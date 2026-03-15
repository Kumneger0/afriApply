import { Page } from "puppeteer";

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  salaryPeriod?: string;
  experienceLevel?: string;
  jobType?: string;
  deadline?: string;
  postedTime: string;
  description: string;
  skills: string[];
  detailsUrl: string;
  isVerified: boolean;
}

export async function parseJobListings(page: Page): Promise<JobListing[]> {
  return await page.evaluate(() => {
    const jobCards = Array.from(
      document.querySelectorAll(".group.flex.cursor-pointer.flex-col"),
    );

    return jobCards.map((card): JobListing => {
      const titleAnchor = card.querySelector("a.text-lg.font-semibold") as HTMLAnchorElement | null;
      const title = titleAnchor?.innerText.trim() || '';
      const detailsUrl = titleAnchor?.href || '';
      
      const id = detailsUrl.match(/id=([^&]+)/)?.[1] || '';

      const metaInfo = card.querySelector(
        ".mt-2.items-center.gap-2.text-sm.font-light.flex",
      );
      const company =
        metaInfo?.querySelector("span:first-child")?.textContent?.trim() || '';
      const location =
        metaInfo?.querySelector("span:nth-child(2)")?.textContent?.trim() || '';

      const isVerified = !!metaInfo?.querySelector("svg");

      const postedTime =
        card.querySelector("p.text-xs.text-stone-500")?.textContent?.trim() || '';

      const description =
        card.querySelector(".prose")?.textContent?.trim() || '';

      const skills = Array.from(
        card.querySelectorAll(".flex.flex-wrap.gap-2 span"),
      ).map((tag) => tag.textContent?.trim() || '').filter(Boolean);

      const metrics: Record<string, string> = {};
      const metricContainers = card.querySelectorAll(".flex.flex-col.gap-1");

      metricContainers.forEach((container) => {
        const value = container.querySelector("p.text-sm")?.textContent?.trim();
        const label = container
          .querySelector("p.text-xs")
          ?.textContent?.trim()
          .toLowerCase();

        if (label && value) {
          const key = label.replace(/\s+/g, "_");
          metrics[key] = value;
        }
      });

      const deadline =
        card
          .querySelector(
            ".flex.flex-1.justify-between p.whitespace-nowrap.text-sm",
          )
          ?.textContent?.trim() || '';

      return {
        id,
        title,
        company,
        location,
        salary: metrics.monthly || undefined,
        experienceLevel: metrics.experience_level || undefined,
        jobType: metrics.job_type || undefined,
        deadline: deadline || undefined,
        postedTime,
        description,
        skills,
        detailsUrl,
        isVerified,
      };
    })
  });
}

export async function scrapeJobListings(page: Page): Promise<JobListing[]> {
  try {
    await page.waitForSelector("nav:has(ul li)", { timeout: 10000 });
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch {
    console.log(
      "Navigation structure not found, trying alternative selectors...",
    );
    try {
      await page.waitForSelector('a[href*="/jobs?id="]', { timeout: 5000 });
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  return await parseJobListings(page);
}

export function saveJobsToJson(
  jobs: JobListing[],
  filename: string = "jobs.json",
): void {
  const fs = require("fs");
  fs.writeFileSync(filename, JSON.stringify(jobs, null, 2));
  console.log(`Saved ${jobs.length} jobs to ${filename}`);
}
export interface ScrapingResult {
  jobs: JobListing[];
  latestJobId: string | null;
  hasMorePages: boolean;
}

export async function checkForLoadMoreButton(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    const loadMoreButton = Array.from(document.querySelectorAll('button')).find(btn => 
      btn.textContent?.includes('Load More')
    );
    
    return !!(loadMoreButton && !loadMoreButton.hasAttribute('disabled'));
  });
}

export async function clickLoadMore(page: Page): Promise<boolean> {
  try {
    const clicked = await page.evaluate(() => {
      const loadMoreButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Load More')
      );
      
      if (loadMoreButton && !loadMoreButton.hasAttribute('disabled')) {
        (loadMoreButton as HTMLButtonElement).click();
        return true;
      }
      return false;
    });

    if (clicked) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      return true;
    }
    return false;
  } catch (error) {
    console.log('Error clicking load more button:', error);
    return false;
  }
}

export async function scrapeAllJobs(
  page: Page, 
  lastKnownJobId?: string
): Promise<ScrapingResult> {
  const allJobs: JobListing[] = [];
  const maxPages = 2;
  let currentPage = 1;
  let latestJobId: string | null = null;
  let foundLastKnownJob = false;

  while (currentPage <= maxPages) {
    try {
      await page.waitForSelector(".group.flex.cursor-pointer.flex-col", { timeout: 10000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch {
      break;
    }

    const pageJobs = await parseJobListings(page);
    
    if (pageJobs.length === 0) {
      break;
    }

    if (currentPage === 1 && pageJobs.length > 0) {
      latestJobId = pageJobs[0]?.id || null
    }

    if (lastKnownJobId) {
      const foundIndex = pageJobs.findIndex(job => job.id === lastKnownJobId);
      if (foundIndex !== -1) {
        allJobs.push(...pageJobs.slice(0, foundIndex));
        foundLastKnownJob = true;
        break;
      }
    }

    allJobs.push(...pageJobs);

    const hasMorePages = await checkForLoadMoreButton(page);
    if (!hasMorePages) {
      break;
    }

    const loadedMore = await clickLoadMore(page);
    if (!loadedMore) {
      break;
    }

    currentPage++;
  }

  return {
    jobs: allJobs.filter((listing, index, arr) => arr.findIndex((l) => l.id == listing.id) == index),
    latestJobId,
    hasMorePages: currentPage <= maxPages && !foundLastKnownJob
  };
}
