import express from "express";
import multer from "multer";
import path from "path";

import fs from "fs/promises";

import takeScreenshot from "./utils/takeScreenshot.js";
import createBrowserPage from "./utils/createBrowserPage.js";
import startViteServer, { DEFAULT_VITE_PORT } from "./utils/startViteServer.js";

const HOST = process.env.HOST || '0.0.0.0';
const API_PORT = process.env.API_PORT || 3000;
const VITE_PORT = process.env.VITE_PORT || DEFAULT_VITE_PORT;

const app = express();

app.disable('x-powered-by');

// Setup multer for file uploads
const upload = multer({
   storage: multer.diskStorage({
       destination: (req, file, cb) => {
           cb(null, 'uploads/');
       },
       filename: (req,file,cb) => {
           cb(null, `${Date.now()}_${file.originalname}`)
       }
   })
});

await startViteServer(VITE_PORT);

// API: Capture screenshot from uploaded image
app.post("/api", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadPath = `uploads/${path.basename(req.file.path)}`;
    const outputPath = `outputs/${path.basename(uploadPath, path.extname(uploadPath))}_result.png`;

    try {
        const { browser, page} = await createBrowserPage();

        await takeScreenshot({
            url: `http://${HOST}:${VITE_PORT}/?image=${encodeURIComponent(uploadPath)}`,
            outputPath,
            page
        })

        await browser.close();
        await fs.unlink(uploadPath); // Cleanup uploaded file

        res.download(outputPath, () => fs.unlink(outputPath)); // Serve and delete the output
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Failed to process image", err });
    }
});

app.listen(API_PORT, HOST, () => {
    console.log(`image-info-helper: POST http://${HOST}:${API_PORT}/api`);
});
