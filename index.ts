import "dotenv/config";
import {
  generateCoverLetters,
  getAiProvider,
  type CoverLetterMatch,
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
import { scheduler } from "./src/scheduler";

import { eq } from "drizzle-orm";
import { Hono } from "hono";
import app from "./src/app/index";
import { db } from "./src/db/index.js";
import { appliedJobs, scrapingState, users } from "./src/db/schema";
import { getScrappingState, getUserProfile } from "./src/lib/utils.js";
import { handleWebhook, sendNotification } from "./src/telegram/bot.js";

interface ScrapingConfig {
  email: string;
  password: string;
  baseUrl: string;
  headless?: boolean;
  outputFile?: string;
}

function getConfigFromEnv(): ScrapingConfig {
  const email = process.env.AFRIWORK_EMAIL;
  const password = process.env.AFRIWORK_PASSWORD;
  const provider = getAiProvider();

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
  profileData: Awaited<ReturnType<typeof getUserProfile>>,
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

    const jobUrl = new URL(`/jobs/${job.jobId}`, baseUrl).href;

    try {
      await session.page.goto(jobUrl, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      await session.page.waitForSelector('textarea[name="coverLetter"]', {
        timeout: 10000,
      });

      const formData: ApplicationFormData = {
        coverLetter: job.coverLetter,
        telegramUsername: profileData.telegramUsername,
        portfolioLinks: profileData.portfolioLinks || [],
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
  return results;
}

async function searchForJobs() {
  let session: AuthenticatedSession | null = null;

  try {
    const config = getConfigFromEnv();
    const profileData = await getUserProfile();
    const lastScrapingState = await getScrappingState();

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
      await session.page.goto(new URL("/jobs", config.baseUrl).href);
    }

    const result = await scrapeAllJobs(
      session.page,
      lastKnownJobId || undefined,
      profileData.jobFilterPreferences || undefined,
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

        const successfulApps = applicationResults.filter((app) => app.success);
        const failedApps = applicationResults.filter((app) => !app.success);

        let notificationMessage = "**Job Application Update**\n\n";

        if (successfulApps.length > 0) {
          notificationMessage += `**Successfully Applied to ${successfulApps.length} job${successfulApps.length > 1 ? "s" : ""}:**\n\n`;
          successfulApps.forEach((app) => {
            notificationMessage += `**${app.jobTitle}** at ${app.company}\n`;
            notificationMessage += `Cover Letter Used:\n"${app.coverLetterUsed}"\n\n`;
          });
        }

        if (failedApps.length > 0) {
          notificationMessage += `**Failed to apply to ${failedApps.length} job${failedApps.length > 1 ? "s" : ""}:**\n\n`;
          failedApps.forEach((app) => {
            notificationMessage += `**${app.jobTitle}** at ${app.company}\n`;
            notificationMessage += `Error: ${app.error || "Unknown error"}\n`;
            notificationMessage += `Cover Letter Prepared:\n"${app.coverLetterUsed}"\n\n`;
          });
        }

        if (allRejectedJobs.length > 0) {
          notificationMessage += `**Found ${result.jobs.length} new jobs, but ${allRejectedJobs.length} didn't match your profile criteria.**\n\n`;
        }

        notificationMessage += `**Summary:**\n`;
        notificationMessage += `• Total jobs found: ${result.jobs.length}\n`;
        notificationMessage += `• Suitable matches: ${allSuitableJobs.length}\n`;
        notificationMessage += `• Successful applications: ${successfulApps.length}\n\n`;

        if (successfulApps.length > 0) {
          notificationMessage += `Great job! Your applications have been submitted successfully.`;
        } else if (allSuitableJobs.length > 0) {
          notificationMessage += `Some applications encountered issues. Please check the logs for details.`;
        } else {
          notificationMessage += `No suitable job matches found this time. Your preferences might be too specific, or try again later for new postings.`;
        }

        await sendNotification(notificationMessage);

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

        let notificationMessage = "**Job Search Update**\n\n";

        if (result.jobs.length > 0) {
          notificationMessage += `Found ${result.jobs.length} new job${result.jobs.length > 1 ? "s" : ""}, but none matched your profile criteria.\n\n`;

          if (allRejectedJobs.length > 0) {
            notificationMessage += `**Common reasons for not matching:**\n`;
            const rejectionReasons = allRejectedJobs
              .slice(0, 3)
              .map((job) => `• ${job.rejectionReason}`)
              .join("\n");
            notificationMessage += rejectionReasons + "\n\n";
          }

          notificationMessage += `**Suggestions:**\n`;
          notificationMessage += `• Consider broadening your job preferences\n`;
          notificationMessage += `• Update your skills or experience if needed\n`;
          notificationMessage += `• Check back later for new job postings\n\n`;
          notificationMessage += `The system will continue monitoring for new opportunities that match your profile.`;
        } else {
          notificationMessage += `No new jobs found since the last check.\n\n`;
          notificationMessage += `This means you're up to date with the latest postings! The system will keep monitoring for new opportunities.`;
        }

        await sendNotification(notificationMessage);
      }

      if (result.hasMorePages) {
      }
    } else {
      await sendNotification(
        "**Job Search Update**\n\n" +
        "No new jobs found since the last check.\n\n" +
        "You're all caught up! The system will continue monitoring for new job postings that match your profile.\n\n" +
        "Next check will happen automatically.",
      );
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

app.post("/webhook/telegram", handleWebhook);

const mainApp = new Hono();
mainApp.route("/", app);

const port = parseInt(process.env.PORT || "3000");
console.log(`Server is running on port ${port}`);
console.log(`Access the setup page at http://localhost:${port}/setup`);

const jobSearchInterval = process.env.JOB_SEARCH_SCHEDULE || "2h";

if (jobSearchInterval !== "disabled") {
  try {
    scheduler.addJob("job-search", jobSearchInterval, async () => {
      console.log("Starting scheduled job search...");
      await searchForJobs();
      console.log("Scheduled job search completed");
    });
    console.log("✅ Job scheduler initialized successfully");
  } catch (error) {
    console.error("Failed to initialize job scheduler:", error);
  }
}

Bun.serve({
  fetch: app.fetch,
  port,
  idleTimeout: 60,
});
