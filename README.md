# 🎬 cast-streaming

An easy-to-use addon to embed and stream YouTube videos with clean HTML, a mini search-style interface, fullscreen support, and optional `.vtt` subtitles.

> 🛠 Simple to set up. Fully customizable. No external player required.

## How to Edit the Code

If you want to fully edit the code, use the link in the top-right corner.

---

## 🚀 Installation

```bash
npm install cast-streaming express yt-search
```

---

### 📦 Features

- ✅ Stream any YouTube video with fullscreen iframe UI
- 🔍 Built-in live YouTube search with yt-search
- 🧱 Static catalog via index.js config
- 🎛️ Uses lite-youtube-embed for fast loading previews
- 🧑‍💻 Fully customizable HTML output (no client-side framework needed)
- 📁 Optional .vtt subtitle references supported

---

## 🔧 Configuration

### 📦 Usage

### 🧰 Quick Start

Create an index.js file in your project to define your video list and icon:

```JavaScript
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

```JavaScript
const express = require("express");
const { addonBuilder, html } = require("cast-streaming");

const app = express();
const addon = addonBuilder();

app.get("/", async (req, res) => {
  const query = req.query.q || "";
  const { html: page, contentType } = await html.getMergedSearchPageHTML(query);
  res.setHeader("Content-Type", contentType);
  res.send(page);
});

app.get("/stream/:id", (req, res) => {
  const id = req.params.id;
  const query = req.query.q || "";
  const stream =
    addon.get(id) ||
    html.getYouTubeStream(id.slice(3), "YouTube Video", [], query);

  if (!stream) return res.status(404).send("Video not found.");
  res.setHeader("Content-Type", stream.contentType);
  res.send(stream.html);
});

app.listen(3000, () =>
  console.log("🎬 cast-streaming running at http://localhost:3000")
);
```

### 🔍 Search Support
When visiting the homepage with /?q=your+keywords, the app will:

- Return live YouTube search results (up to 10)

- Render each video preview using <lite-youtube>

- Maintain query state when opening and returning from video stream

Example:

```Link
http://localhost:3000/?q=lofi+beats
```

---

## ✨ API
`addonBuilder()`
Creates a stream resolver from your videos[] config.
`html.getYouTubeStream(ytId, title, subtitles?)`
Returns a player page for the given YouTube ID.
- `ytId` (string): YouTube video ID (no prefix)
- `title` (string): Display title
- `subtitles` (string[]) (optional): List of .vtt files
- `backQuery` (string) (optional): Value to preserve ?q= for return

`html.getMergedSearchPageHTML(query?)`
Returns full HTML for homepage, with optional YouTube search result injection.

`dataset`
The full generated dataset from your index.js, useful for debugging.

---

## 📝 Notes

- YouTube `<iframe>` embed does not support `.vtt` subtitles — you must use an HTML5 `<video>` if you need true subtitle support.

- Any subtitle files (e.g., `Subs/en.vtt`) must be publicly served via Express (`app.use(express.static("Subs"))`)

---

## 📄 License
MIT © Progamingsang

MIT License

Copyright (c) 2025 by Vienxamxi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---