import { Page } from "puppeteer";

export interface ApplicationFormData {
  coverLetter: string;
  telegramUsername?: string | null
  portfolioLinks?: string[];
}

export interface FormFillingOptions {
  timeout?: number;
  waitForNavigation?: boolean;
}

export async function fillJobApplicationForm(
  page: Page,
  formData: ApplicationFormData,
  options: FormFillingOptions = {},
): Promise<void> {
  const timeout = options.timeout || 10000;

  try {
    await page.waitForSelector('textarea[name="coverLetter"]', { timeout });

    if (formData.coverLetter) {
      await page.click('textarea[name="coverLetter"]');
      await page.keyboard.down("Control");
      await page.keyboard.press("KeyA");
      await page.keyboard.up("Control");
      await page.type('textarea[name="coverLetter"]', formData.coverLetter);
    }

    if (formData.telegramUsername) {
      const telegramInput = await page.$('input[name="telegramUserName"]');
      if (telegramInput) {
        await page.click('input[name="telegramUserName"]');
        await page.keyboard.down("Control");
        await page.keyboard.press("KeyA");
        await page.keyboard.up("Control");
        await page.type(
          'input[name="telegramUserName"]',
          formData.telegramUsername,
        );
      }
    }

    if (formData.portfolioLinks && formData.portfolioLinks.length > 0) {
      const portfolioInput = await page.$('input[name="portfolioLink"]');
      const portfolioLink =  formData.portfolioLinks?.[0]
      if (portfolioInput && portfolioLink) {
        await page.click('input[name="portfolioLink"]');
        await page.keyboard.down("Control");
        await page.keyboard.press("KeyA");
        await page.keyboard.up("Control");
        await page.type(
          'input[name="portfolioLink"]',
         portfolioLink,
        );
      }
    }

  } catch (error) {
    console.error("Error filling form:", error);
    throw error;
  }
}

export async function submitJobApplication(
  page: Page,
  options: FormFillingOptions = {},
): Promise<void> {
  try {
    const submitButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button[type="submit"]'));
      return buttons.find(btn => btn.textContent?.toLowerCase().includes('submit')) || 
             buttons.find(btn => btn.textContent?.toLowerCase().includes('apply')) ||
             buttons[0];
    });

    if (submitButton && submitButton.asElement()) {
      console.log('applied', submitButton.toString())
      // await submitButton.asElement()?.click();
    } else {
      throw new Error("Submit button not found");
    }

    if (options.waitForNavigation) {
      await page.waitForNavigation({
        waitUntil: "domcontentloaded",
        timeout: options.timeout || 10000,
      });
    }

    console.log("form submitted successfully");
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
}
