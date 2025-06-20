# 🎬 cast-streaming

An easy-to-use addon to embed and stream YouTube videos with clean HTML, a mini search-style interface, fullscreen support, and optional `.vtt` subtitles.

> 🛠 Simple to set up. Fully customizable. No external player required.

---

## 🚀 Installation

```bash
npm install cast-streaming express
```

---

## 🔧 Configuration

📦 Usage

Create an index.js file in your project to define your video list and icon:

```bash
module.exports = {
  icon: "https://www.youtube.com/s/desktop/f8fbb2fa/img/favicon_144x144.png",
  videos: [
    {
      id: "yt:dQw4w9WgXcQ",
      ytId: "dQw4w9WgXcQ",
      title: "Never Gonna Give You Up",
      type: "music",
      displayTitle: "RickRoll Classic",
      sourceName: "YouTube",
      channel: "Rick Astley",
      duration: "3:33",
      audio: ["English"],
      subtitles: ["Subs/en.vtt", "Subs/vi.vtt"] // optional
    }
  ]
};
```

💻 Set up a minimal code server.js with Express server

```bash
const express = require("express");
const { html, dataset, addonBuilder } = require("cast-streaming");

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
  console.log("🚀 Server running at http://localhost:3000");
});
```

---

##

✨ API
addonBuilder()
Creates a stream resolver from your videos[] config.

html.getYouTubeStream(ytId, title, subtitles?)
Returns an HTML page to embed and stream a single YouTube video.

ytId: YouTube video ID

title: display title

subtitles: array of .vtt files (optional)

html.getYouTubeSearchPageHTML()
Returns an HTML list of all configured videos — mimicking YouTube search result UI.

dataset
Automatically generated from videos[], formatted as:

```bash
{
  "yt:dQw4w9WgXcQ": {
    name: "Never Gonna Give You Up",
    type: "music",
    sources: [
      {
        ytId: "dQw4w9WgXcQ",
        displayTitle: "RickRoll Classic",
        sourceName: "YouTube",
        channel: "Rick Astley",
        duration: "3:33",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        audio: ["English"],
        subtitles: ["Subs/en.vtt", "Subs/vi.vtt"]
      }
    ]
  }
}
```

📝 Notes
- YouTube embed (iframe) does not support custom .vtt subtitles. Use HTML5 <video> + .mp4 if needed.

- Files like Subs/en.vtt or en.vtt must be statically served by your server.

🔗 License
MIT © Progamingsang

---

If you need this README to include demo screenshots or badge shields (downloads, license, etc), I can customize that too. Ready to make it public? 🚀📦💡

---
