import {
  generateCoverLetters,
  type AIProvider,
  type CoverLetterMatch,
  type UserProfile,
} from "./src/ai/aiHelper";
import {
  cleanup,
  loginToAfriwork,
  type AuthenticatedSession,
} from "./src/auth/login";
import {
  fillJobApplicationForm,
  submitJobApplication,
  type ApplicationFormData,
} from "./src/browser/formFiller";
import { scrapeAllJobs, type JobListing } from "./src/lib/jobParser";

import { eq } from "drizzle-orm";
import { Hono } from "hono";
import app from "./src/app/index";
import { db } from "./src/db/index.js";
import { appliedJobs, scrapingState, users } from "./src/db/schema";
import { getScrappingState, getUserProfile } from "./src/lib/utils.js";

interface ScrapingConfig {
  email: string;
  password: string;
  baseUrl: string;
  headless?: boolean;
  outputFile?: string;
  provider: AIProvider;
}

function getConfigFromEnv(): ScrapingConfig {
  const email = process.env.AFRIWORK_EMAIL;
  const password = process.env.AFRIWORK_PASSWORD;
  const provider = process.env.AI_PROVIDER as AIProvider | undefined;

  if (!email || !password || !provider) {
    throw new Error(
      "missing required environment variables: AFRIWORK_EMAIL, AFRIWORK_PASSWORD and AI_PROVIDER",
    );
  }

  return {
    email,
    password,
    baseUrl: process.env.AFRIWORK_BASE_URL || "https://afriworket.com",
    headless: process.env.HEADLESS !== "false",
    provider,
  };
}
interface ApplicationResult {
  jobId: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  coverLetterUsed: string;
  success: boolean;
  error?: string;
  appliedAt: string;
}

async function applyToSuitableJobs(
  session: AuthenticatedSession,
  suitableJobs: CoverLetterMatch[],
  profileData: UserProfile,
  baseUrl: string,
  allJobs: JobListing[],
): Promise<ApplicationResult[]> {
  const results: ApplicationResult[] = [];

  for (const job of suitableJobs) {
    const originalJob = allJobs.find((j) => j.id === job.jobId);

    const result: ApplicationResult = {
      jobId: job.jobId,
      jobTitle: job.jobTitle,
      company: job.company,
      jobDescription: originalJob?.description || "",
      coverLetterUsed: job.coverLetter,
      success: false,
      appliedAt: new Date().toISOString(),
    };

    try {
      const jobUrl = `${baseUrl}/jobs/${job.jobId}`;
      await session.page.goto(jobUrl, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      await session.page.waitForSelector('textarea[name="coverLetter"]', {
        timeout: 10000,
      });

      const formData: ApplicationFormData = {
        coverLetter: job.coverLetter,
        telegramUsername: profileData.personalInfo.telegramUsername,
        portfolioLinks: profileData.personalInfo.portfolioLinks || [],
      };

      await fillJobApplicationForm(session.page, formData, { timeout: 10000 });

      await submitJobApplication(session.page, {
        waitForNavigation: false,
        timeout: 10000,
      });

      result.success = true;

      await new Promise((resolve) =>
        setTimeout(resolve, 2000 + Math.random() * 3000),
      );
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      console.error(`Failed to apply to ${job.jobTitle}:`, error);
    }

    results.push(result);
  }

  const fs = await import("fs");
  fs.writeFileSync(
    "application-results.json",
    JSON.stringify(results, null, 2),
  );
  console.log(`Application results saved to application-results.json`);

  return results;
}

async function searchForJobs() {
  let session: AuthenticatedSession | null = null;

  try {
    const config = getConfigFromEnv();
   const profileData = await getUserProfile()
    const lastScrapingState = await getScrappingState()

    const lastKnownJobId = lastScrapingState?.latestJobId ?? "";

    session = await loginToAfriwork(
      {
        email: config.email,
        password: config.password,
      },
      {
        baseUrl: config.baseUrl,
        headless: config.headless,
        timeout: 100000,
      },
    );

    const currentUrl = session.page.url();

    if (!currentUrl.includes("/jobs")) {
      await session.page.goto(`${config.baseUrl}/jobs`);
    }

    const result = await scrapeAllJobs(
      session.page,
      lastKnownJobId || undefined,
      profileData.jobFilterPreferences || undefined
    );

    if (result.jobs.length > 0) {
      let allSuitableJobs: Awaited<
        ReturnType<typeof generateCoverLetters>
      >["suitableJobs"] = [];
      let allRejectedJobs: Awaited<
        ReturnType<typeof generateCoverLetters>
      >["rejectedJobs"] = [];

      if (result.jobs.length) {
        const chunkSize = 3;
        const jobChunks: JobListing[][] = [];

        for (let i = 0; i < result.jobs.length; i += chunkSize) {
          jobChunks.push(result.jobs.slice(i, i + chunkSize));
        }

        for (const chunk of jobChunks) {
          const { suitableJobs, rejectedJobs } = await generateCoverLetters(
            profileData,
            chunk,
            config.provider,
          );

          allSuitableJobs.push(...suitableJobs);
          allRejectedJobs.push(...rejectedJobs);
        }
      }

      if (allRejectedJobs.length > 0) {
        allRejectedJobs.forEach((job) => {
          console.log(
            `- ${job.jobTitle} at ${job.company}: ${job.rejectionReason}`,
          );
        });
      }

      if (allSuitableJobs.length > 0) {
        const applicationResults = await applyToSuitableJobs(
          session,
          allSuitableJobs,
          profileData,
          config.baseUrl,
          result.jobs,
        );

        const user = await db.select().from(users).limit(1).get();
        if (user) {
          const successfulApplications = applicationResults.filter(
            (app) => app.success,
          );

          if (successfulApplications.length > 0) {
            await db
              .insert(appliedJobs)
              .values(
                successfulApplications.map((app) => ({
                  userId: user.id,
                  jobId: app.jobId,
                  title: app.jobTitle,
                  description: `${app.jobTitle} at ${app.company}`,
                })),
              )
              .run();

            console.log(
              `Saved ${successfulApplications.length} successful applications to database`,
            );
          }

          if (result.latestJobId) {
            const existing = await db
              .select()
              .from(scrapingState)
              .where(eq(scrapingState.userId, user.id))
              .limit(1)
              .get();

            if (existing) {
              await db
                .update(scrapingState)
                .set({
                  latestJobId: result.latestJobId,
                  updatedAt: new Date().toISOString(),
                })
                .where(eq(scrapingState.userId, user.id))
                .run();
            } else {
              await db
                .insert(scrapingState)
                .values({
                  userId: user.id,
                  latestJobId: result.latestJobId,
                })
                .run();
            }
            console.log(`updated latest scraped job ID: ${result.latestJobId}`);
          }
        }

        return {
          applicationResults,
          suitableJobs: allSuitableJobs,
          rejectedJobs: allRejectedJobs,
        };
      } else {
        console.log("no suitable jobs found for application");
      }

      if (result.hasMorePages) {
      }
    } else {
    }
  } catch (error) {
    console.error("Error during job scraping:", error);
    throw error;
  } finally {
    if (session) {
      await cleanup(session);
      console.log("browser session cleaned up");
    }
  }
}

app.get("/apply", async (c) => {
  try {
    const response = await searchForJobs();
    c.json(response);
  } catch (err) {
    console.error(err);
  }
});

const mainApp = new Hono();
mainApp.route("/", app);

const port = parseInt(process.env.PORT || "3000");
console.log(`Server is running on port ${port}`);
console.log(`Access the setup page at http://localhost:${port}/setup`);

Bun.serve({
  fetch: app.fetch,
  port,
  idleTimeout: 60,
});
