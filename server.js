const express = require("express");
const dataset = require("./dataset");
const { addonBuilder } = require("./addon");
const { getYouTubeSearchPageHTML } = require("./streaming/youtube");

const app = express();
const addon = addonBuilder(dataset);

// Trang danh sách video kiểu “YouTube search”
app.get("/", (req, res) => {
  const { html, contentType } = getYouTubeSearchPageHTML();
  res.setHeader("Content-Type", contentType);
  res.send(html);
});

// Trang phát stream theo ID
app.get("/stream/:id", (req, res) => {
  const streamData = addon.get(req.params.id);
  if (!streamData) return res.status(404).send("Không tìm thấy video");

  if (streamData.html) {
    res.setHeader("Content-Type", streamData.contentType || "text/html");
    return res.send(streamData.html);
  }

  if (streamData.redirectUrl) {
    return res.redirect(streamData.redirectUrl);
  }

  res.status(500).send("Không có dữ liệu hợp lệ.");
});

app.listen(3000, () => {
  console.log("📺 Server đang chạy tại http://localhost:3000");
});