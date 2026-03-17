import { Page } from "puppeteer";
import type { JobFilterPreferencesSchemaType } from "../app/validation";

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
      const titleAnchor = card.querySelector(
        "a.text-lg.font-semibold",
      ) as HTMLAnchorElement | null;
      const title = titleAnchor?.innerText.trim() || "";
      const detailsUrl = titleAnchor?.href || "";

      const id = detailsUrl.match(/id=([^&]+)/)?.[1] || "";

      const metaInfo = card.querySelector(
        ".mt-2.items-center.gap-2.text-sm.font-light.flex",
      );
      const company =
        metaInfo?.querySelector("span:first-child")?.textContent?.trim() || "";
      const location =
        metaInfo?.querySelector("span:nth-child(2)")?.textContent?.trim() || "";

      const isVerified = !!metaInfo?.querySelector("svg");

      const postedTime =
        card.querySelector("p.text-xs.text-stone-500")?.textContent?.trim() ||
        "";

      const description =
        card.querySelector(".prose")?.textContent?.trim() || "";

      const skills = Array.from(
        card.querySelectorAll(".flex.flex-wrap.gap-2 span"),
      )
        .map((tag) => tag.textContent?.trim() || "")
        .filter(Boolean);

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
          ?.textContent?.trim() || "";

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
    });
  });
}

export interface ScrapingResult {
  jobs: JobListing[];
  latestJobId: string | null;
  hasMorePages: boolean;
}

export async function clickLoadMore(page: Page): Promise<boolean> {
  try {
    const clicked = await page.evaluate(() => {
      const loadMoreButton = Array.from(
        document.querySelectorAll("button"),
      ).find((btn) => btn.textContent?.includes("Load More"));

      if (loadMoreButton && !loadMoreButton.hasAttribute("disabled")) {
        (loadMoreButton as HTMLButtonElement).click();
        return true;
      }
      return false;
    });

    if (clicked) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error clicking load more button:", error);
    return false;
  }
}

async function applyJobFilters(
  page: Page,
  jobFilterPreferences: JobFilterPreferencesSchemaType,
): Promise<void> {
  try {
    if (jobFilterPreferences.sector) {
      try {
        await page.evaluate((sector) => {
          const comboboxButton = document.querySelector(
            '[role="button"]',
          ) as HTMLElement;
          if (
            comboboxButton &&
            comboboxButton.textContent?.includes("Select sector")
          ) {
            comboboxButton.click();

            setTimeout(() => {
              const options = Array.from(
                document.querySelectorAll('[role="option"]'),
              );
              const option = options.find(
                (opt) => opt.textContent?.trim() === sector,
              );
              if (option) {
                (option as HTMLElement).click();
                console.log(`Applied sector filter: ${sector}`);
              }
            }, 500);
          }
        }, jobFilterPreferences.sector);

        await new Promise((res) => setTimeout(res, 1000));
      } catch (error) {
        console.log("Could not apply sector filter:", error);
      }
    }

    if (
      jobFilterPreferences.jobTypes &&
      jobFilterPreferences.jobTypes.length > 0
    ) {
      try {
        for (const jobType of jobFilterPreferences.jobTypes) {
          await page.evaluate((type) => {
            const labels = Array.from(document.querySelectorAll("label"));
            const label = labels.find((l) => l.textContent?.trim() === type);

            if (label) {
              const forAttribute = label.getAttribute("for");
              if (forAttribute) {
                const checkbox = document.getElementById(
                  forAttribute,
                ) as HTMLInputElement;
                if (
                  checkbox &&
                  checkbox.type === "checkbox" &&
                  !checkbox.checked
                ) {
                  checkbox.click();
                  console.log(`Applied job type filter: ${type}`);
                }
              }
            }
          }, jobType);

          await new Promise((res) => setTimeout(res, 500));
        }
      } catch (error) {
        console.log("Could not apply job types filter:", error);
      }
    }

    if (
      jobFilterPreferences.jobSites &&
      jobFilterPreferences.jobSites.length > 0
    ) {
      try {
        for (const jobSite of jobFilterPreferences.jobSites) {
          await page.evaluate((site) => {
            const labels = Array.from(document.querySelectorAll("label"));
            const label = labels.find((l) => l.textContent?.trim() === site);

            if (label) {
              const forAttribute = label.getAttribute("for");
              if (forAttribute) {
                const checkbox = document.getElementById(
                  forAttribute,
                ) as HTMLInputElement;
                if (
                  checkbox &&
                  checkbox.type === "checkbox" &&
                  !checkbox.checked
                ) {
                  checkbox.click();
                  console.log(`Applied job site filter: ${site}`);
                }
              }
            }
          }, jobSite);

          await new Promise((res) => setTimeout(res, 500));
        }
      } catch (error) {
        console.log("Could not apply job sites filter:", error);
      }
    }

    if (jobFilterPreferences.experienceLevel) {
      try {
        await page.evaluate((level) => {
          const labels = Array.from(document.querySelectorAll("label"));
          const label = labels.find((l) => l.textContent?.trim() === level);

          if (label) {
            const forAttribute = label.getAttribute("for");
            if (forAttribute) {
              const checkbox = document.getElementById(
                forAttribute,
              ) as HTMLInputElement;
              if (
                checkbox &&
                checkbox.type === "checkbox" &&
                !checkbox.checked
              ) {
                checkbox.click();
                console.log(`Applied experience level filter: ${level}`);
              }
            }
          }
        }, jobFilterPreferences.experienceLevel);

        await new Promise((res) => setTimeout(res, 500));
      } catch (error) {
        console.log("Could not apply experience level filter:", error);
      }
    }

    if (jobFilterPreferences.educationLevel) {
      try {
        await page.evaluate((level) => {
          const labels = Array.from(document.querySelectorAll("label"));
          const label = labels.find((l) => l.textContent?.trim() === level);

          if (label) {
            const forAttribute = label.getAttribute("for");
            if (forAttribute) {
              const checkbox = document.getElementById(
                forAttribute,
              ) as HTMLInputElement;
              if (
                checkbox &&
                checkbox.type === "checkbox" &&
                !checkbox.checked
              ) {
                checkbox.click();
                console.log(`Applied education level filter: ${level}`);
              }
            }
          }
        }, jobFilterPreferences.educationLevel);

        await new Promise((res) => setTimeout(res, 500));
      } catch (error) {
        console.log("Could not apply education level filter:", error);
      }
    }

    if (jobFilterPreferences.genderPreference) {
      try {
        await page.evaluate((gender) => {
          const labels = Array.from(document.querySelectorAll("label"));
          const label = labels.find((l) => l.textContent?.trim() === gender);

          if (label) {
            const forAttribute = label.getAttribute("for");
            if (forAttribute) {
              const checkbox = document.getElementById(
                forAttribute,
              ) as HTMLInputElement;
              if (
                checkbox &&
                checkbox.type === "checkbox" &&
                !checkbox.checked
              ) {
                checkbox.click();
                console.log(`Applied gender preference filter: ${gender}`);
              }
            }
          }
        }, jobFilterPreferences.genderPreference);

        await new Promise((res) => setTimeout(res, 500));
      } catch (error) {
        console.log("Could not apply gender preference filter:", error);
      }
    }

    await new Promise((res) => setTimeout(res, 3000));
  } catch (error) {
    console.log("Error applying filters:", error);
  }
}

export async function scrapeAllJobs(
  page: Page,
  lastKnownJobId?: string,
  jobFilterPreferences?: JobFilterPreferencesSchemaType,
): Promise<ScrapingResult> {
  const allJobs: JobListing[] = [];
  const maxPages = 2;
  let currentPage = 1;
  let latestJobId: string | null = null;
  let foundLastKnownJob = false;

  if (jobFilterPreferences) {
    await applyJobFilters(page, jobFilterPreferences);
  }

  while (currentPage <= maxPages) {
    try {
      await page.waitForSelector(".group.flex.cursor-pointer.flex-col", {
        timeout: 10000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch {
      break;
    }

    const pageJobs = await parseJobListings(page);

    if (pageJobs.length === 0) {
      break;
    }

    if (currentPage === 1 && pageJobs.length > 0) {
      latestJobId = pageJobs[0]?.id || null;
    }

    if (lastKnownJobId) {
      const foundIndex = pageJobs.findIndex((job) => job.id === lastKnownJobId);
      if (foundIndex !== -1) {
        allJobs.push(...pageJobs.slice(0, foundIndex));
        foundLastKnownJob = true;
        break;
      }
    }

    allJobs.push(...pageJobs);
    await clickLoadMore(page);
    currentPage++;
  }

  return {
    jobs: allJobs.filter(
      (listing, index, arr) =>
        arr.findIndex((l) => l.id == listing.id) == index,
    ),
    latestJobId,
    hasMorePages: currentPage <= maxPages && !foundLastKnownJob,
  };
}
