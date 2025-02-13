async function takeScreenshot({
      page,
      url,
      outputPath,
      selectorToWaitFor = "img[data-component-path=\"src/pages/ImageInfoHelper.tsx\"]",
      viewportSize = { width: 1080, height: 1350 }
}) {
    await page.setViewportSize(viewportSize);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector(selectorToWaitFor, { state: "visible" });
    await page.locator("body").screenshot({ path: outputPath });
}

export default takeScreenshot;