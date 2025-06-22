const express = require("express");
const { html, addonBuilder } = require("cast-streaming");

const app = express();
const addon = addonBuilder();

app.get("/", (req, res) => {
  const page = html.getYouTubeSearchPageHTML();
  res.setHeader("Content-Type", page.contentType);
  res.send(page.html);
});

app.get("/stream/:id", (req, res) => {
  const stream = addon.get(req.params.id);
  if (!stream) return res.status(404).send("Video not found");
  res.setHeader("Content-Type", stream.contentType);
  res.send(stream.html);
});

app.listen(3000, () => {
  console.log("🚀 Server is running at http://localhost:3000");
});