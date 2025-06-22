const express = require("express");
const dataset = require("./dataset");
const { addonBuilder } = require("./addon");
const {
  getYouTubeStream,
  getMergedSearchPageHTML
} = require("./streaming/youtube");

const app = express();
const addon = addonBuilder(dataset);

/**
 * Homepage — render search box + combined video list
 */
app.get("/", async (req, res) => {
  try {
    const query = req.query.q || "";
    const { html, contentType } = await getMergedSearchPageHTML(query);
    res.setHeader("Content-Type", contentType);
    res.send(html);
  } catch (err) {
    console.error("Error rendering homepage:", err.message || err);
    res.status(500).send("An error occurred while loading the homepage.");
  }
});

/**
 * Stream player — render video by ID
 * Handles both static (from index.js) and dynamic (yt-search) videos
 */
app.get("/stream/:id", (req, res) => {
  const id = req.params.id;
  const query = req.query.q || "";

  // Check static dataset first
  const stream = addon.get(id);
  if (stream) {
    res.setHeader("Content-Type", stream.contentType);
    return res.send(stream.html);
  }

  // If dynamic search video (yt:...), render player directly
  if (id.startsWith("yt:")) {
    const ytId = id.slice(3);
    const { html, contentType } = getYouTubeStream(ytId, "YouTube Video", [], query);
    res.setHeader("Content-Type", contentType);
    return res.send(html);
  }

  // Fallback
  res.status(404).send("Video not found.");
});

/**
 * Catch-all 404
 */
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});