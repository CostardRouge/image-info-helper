import path from "path";

import takeScreenshot from "./utils/takeScreenshot.js";
import createBrowserPage from "./utils/createBrowserPage.js";
import startViteServer, { DEFAULT_VITE_PORT } from "./utils/startViteServer.js";

async function captureScreenshot() {
    const server = await startViteServer();
    const { browser, page} = await createBrowserPage();
    const [ ,, target = ".", ...imagePaths ] = process.argv;

    console.log({imagePaths})

    for (const imagePath of imagePaths) {
        await takeScreenshot({
            url: `http://localhost:${DEFAULT_VITE_PORT}/?image=${encodeURIComponent(imagePath)}`,
            outputPath: `${target}/${path.basename(imagePath, path.extname(imagePath))}_result.png`,
            page
        })
    }

    await browser.close();
    await server.close();
}

captureScreenshot()
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });