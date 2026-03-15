import { loginToAfriwork, cleanup, type AuthenticatedSession } from "./src/auth/login.js";
import {
  scrapeAllJobs,
  saveJobsToJson,
} from "./src/lib/jobParser.js";
import { generateCoverLetters, type AIProvider, type CoverLetterMatch, type UserProfile } from "./src/ai/aiHelper.js";
import { fillJobApplicationForm, submitJobApplication, type ApplicationFormData } from "./src/browser/formFiller.js";
import { getProfile } from "./src/lib/utils";

interface ScrapingConfig {
  email: string;
  password: string;
  baseUrl: string;
  headless?: boolean;
  outputFile?: string;
  provider:AIProvider
}

function getConfigFromEnv(): ScrapingConfig {
  const email = process.env.AFRIWORK_EMAIL;
  const password = process.env.AFRIWORK_PASSWORD;
  const provider = process.env.AI_PROVIDER as AIProvider | undefined

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
    provider
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
  allJobs: any[]
): Promise<ApplicationResult[]> {
  const results: ApplicationResult[] = [];
  
  for (const job of suitableJobs) {
    const originalJob = allJobs.find(j => j.id === job.jobId);
    
    const result: ApplicationResult = {
      jobId: job.jobId,
      jobTitle: job.jobTitle,
      company: job.company,
      jobDescription: originalJob?.description || '',
      coverLetterUsed: job.coverLetter,
      success: false,
      appliedAt: new Date().toISOString()
    };
    
    try {
      const jobUrl = `${baseUrl}/jobs/${job.jobId}`;
      await session.page.goto(jobUrl, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });
      
      await session.page.waitForSelector('textarea[name="coverLetter"]', { 
        timeout: 10000 
      });
      
      const formData: ApplicationFormData = {
        coverLetter: job.coverLetter,
        telegramUsername: profileData.personalInfo.telegramUsername,
        portfolioLinks: profileData.personalInfo.portfolioLinks || [],
      };
      
      await fillJobApplicationForm(session.page, formData, { timeout: 10000 });
      
      await submitJobApplication(session.page, { 
        waitForNavigation: false, 
        timeout: 10000 
      });
      
      result.success = true;
      console.log(`Successfully applied to ${job.jobTitle}`);
      
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      console.error(`Failed to apply to ${job.jobTitle}:`, error);
    }
    
    results.push(result);
  }
  
  const fs = await import('fs');
  fs.writeFileSync('application-results.json', JSON.stringify(results, null, 2));
  console.log(`Application results saved to application-results.json`);
  
  return results;
}

async function searchForJobs() {
  let session: AuthenticatedSession | null = null;

  try {
    const config = getConfigFromEnv();
    const lastKnownJobId = '' // imagine this is coming from db

    session = await loginToAfriwork(
      {
        email: config.email,
        password: config.password,
      },
      {
        baseUrl: config.baseUrl,
        headless: config.headless,
        timeout:100000
      },
    );

    const currentUrl = session.page.url();

    if (!currentUrl.includes("/jobs")) {
      await session.page.goto(`${config.baseUrl}/jobs`);
    }

    const result = await scrapeAllJobs(
      session.page,
      lastKnownJobId || undefined,
    );

    if (result.jobs.length > 0) {
      saveJobsToJson(result.jobs, config.outputFile!);

      if (result.latestJobId) {
        //save the latest job to database
      }

      const profileData = getProfile()
      const { suitableJobs, rejectedJobs } = await generateCoverLetters(
        profileData,
        result.jobs, 
        config.provider
      );
      
      
      if (rejectedJobs.length > 0) {
        rejectedJobs.forEach(job => {
          console.log(`- ${job.jobTitle} at ${job.company}: ${job.rejectionReason}`);
        });
      }
      
      if (suitableJobs.length > 0) {
        const applicationResults = await applyToSuitableJobs(session, suitableJobs, profileData, config.baseUrl, result.jobs);
        return { applicationResults, suitableJobs, rejectedJobs };
      } else {
        console.log('no suitable jobs found for application');
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

  searchForJobs()
    .then((results) => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
