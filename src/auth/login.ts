import puppeteer, { Browser, Page } from "puppeteer";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginOptions {
  headless?: boolean;
  timeout?: number;
  baseUrl?: string;
}

export interface AuthenticatedSession {
  browser: Browser;
  page: Page;
}

async function createBrowser(options: LoginOptions = {}): Promise<Browser> {
  return await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: !!options.headless,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--user-data-dir=/tmp/chrome-data",
    ],
  });
}

async function setupPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  await page.setBypassCSP(true);
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  );
  await page.setViewport({ width: 1280, height: 720 });
  return page;
}

async function fillLoginForm(
  page: Page,
  credentials: LoginCredentials,
): Promise<void> {
  await page.click('input[name="email"]');
  await page.keyboard.down("Control");
  await page.keyboard.press("KeyA");
  await page.keyboard.up("Control");
  await page.type('input[name="email"]', credentials.email);

  await page.click('input[name="password"]');
  await page.keyboard.down("Control");
  await page.keyboard.press("KeyA");
  await page.keyboard.up("Control");
  await page.type('input[name="password"]', credentials.password);
}

async function handleProfileSelection(
  page: Page,
  timeout: number = 30000,
): Promise<void> {
  try {
    await page.waitForNetworkIdle();

    const currentUrl = page.url();
    if (!currentUrl.includes("/profiles")) {
      return;
    }

    const buttons = await page.$$("button");
    for (const button of buttons) {
      const text = await page.evaluate((el) => el.textContent, button);
      if (text && text.includes("Job Seeker")) {
        await button.click();
        await page.waitForNetworkIdle();
        break;
      }
    }
  } catch (error) {}
}

export async function loginToAfriwork(
  credentials: LoginCredentials,
  options: LoginOptions = {},
): Promise<AuthenticatedSession> {
  const baseUrl = options.baseUrl || "https://afriworket.com";
  const timeout = options.timeout || 30000;

  const browser = await createBrowser(options);
  const page = await setupPage(browser);

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  try {
    await page.goto(`${baseUrl}/auth/login`, {
      waitUntil: "networkidle2",
      timeout,
    });

    await page.waitForSelector('input[name="email"]', { timeout });
    await page.waitForSelector('input[name="password"]', { timeout });
    await new Promise((res) => setTimeout(res, 5000));
    await fillLoginForm(page, credentials);

    await page.click('button[type="submit"]');
    const navPromise = page
      .waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 })
      .catch((err) => {
        console.error(err);
      });
    await new Promise((res) => setTimeout(res, 5000));
    await navPromise;

    const loginSuccess = await isLoggedIn(page);
    if (!loginSuccess) {
      throw new Error("Login failed - unable to access profiles page");
    }

    await handleProfileSelection(page, timeout);
    return { browser, page };
  } catch (error) {
    await browser.close();
    throw error;
  }
}

export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.goto("https://afriworket.com/profiles", {
      waitUntil: "networkidle2",
      timeout: 100000,
    });

    const currentUrl = page.url();

    if (currentUrl.includes("/auth/login")) {
      return false;
    }

    if (currentUrl.includes("/profiles")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export async function cleanup(session: AuthenticatedSession): Promise<void> {
  await session.page.close();
  await session.browser.close();
}
