const express = require("express");
const dataset = require("./dataset");
const { addonBuilder } = require("./addon");
const { getYouTubeSearchPageHTML } = require("./streaming/youtube");

const app = express();
const addon = addonBuilder(dataset);

// Video list page (YouTube-style search results)
app.get("/", (req, res) => {
  const { html, contentType } = getYouTubeSearchPageHTML();
  res.setHeader("Content-Type", contentType);
  res.send(html);
});

// Stream player page by ID
app.get("/stream/:id", (req, res) => {
  const streamData = addon.get(req.params.id);
  if (!streamData) return res.status(404).send("Video not found.");

  if (streamData.html) {
    res.setHeader("Content-Type", streamData.contentType || "text/html");
    return res.send(streamData.html);
  }

  if (streamData.redirectUrl) {
    return res.redirect(streamData.redirectUrl);
  }

  res.status(500).send("Invalid stream data.");
});

app.listen(3000, () => {
  console.log("📺 Server is running at http://localhost:3000");
});
