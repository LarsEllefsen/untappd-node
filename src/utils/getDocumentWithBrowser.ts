import { connect } from 'puppeteer-real-browser';
import HTTPException from '../common/HTTPException';

export const getDocumentWithBrowser = async (url: string) => {
  const { page, browser } = await connect({
    headless: true,
    turnstile: true,
    disableXvfb: false,
  });
  try {
    const response = await page.goto(url);

    if (response === null) {
      throw new Error(`No response from ${url}`);
    }

    if (!response.ok()) {
      const text = await response.text();
      const errorMessage = text && text !== '' ? text : response.statusText();
      throw new HTTPException(response.status(), errorMessage);
    }

    return {
      body: await response.text(),
      headers: response.headers(),
    };
  } finally {
    browser.close();
  }
};
