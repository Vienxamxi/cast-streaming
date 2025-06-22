const ytSearch = require("yt-search");
const { icon, videos: staticVideos } = require("../index");

/**
 * Render a fullscreen player for YouTube videos
 */
function getYouTubeStream(videoId, displayTitle = "", subtitles = [], backQuery = "") {
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return {
    redirectUrl: `https://www.youtube.com/watch?v=${videoId}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>${displayTitle}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              margin: 0;
              background: url('${thumbnail}') no-repeat center center fixed;
              background-size: cover;
              font-family: sans-serif;
              color: white;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              position: relative;
            }
            .overlay {
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.6);
              backdrop-filter: blur(5px);
              z-index: 0;
            }
            h1 {
              z-index: 1;
              margin-bottom: 1rem;
              text-shadow: 0 0 10px black;
            }
            iframe {
              z-index: 1;
              border: none;
              box-shadow: 0 0 30px rgba(0,0,0,0.7);
            }
            .controls {
              z-index: 1;
              margin-top: 1rem;
              display: flex;
              gap: 1rem;
            }
            button {
              padding: 0.5rem 1rem;
              background: rgba(255,255,255,0.1);
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            button:hover {
              background: rgba(255,255,255,0.3);
            }
          </style>
        </head>
        <body>
          <div class="overlay"></div>
          <h1>🎬 ${displayTitle}</h1>
          <iframe id="ytPlayer" width="640" height="360"
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
            allow="autoplay; encrypted-media"
            allowfullscreen>
          </iframe>
          <div class="controls">
            <button onclick="location.href='/?q=${encodeURIComponent(backQuery)}'">🔙 Back</button>
            <button onclick="toggleFullscreen()">🖥 Fullscreen</button>
          </div>
          <script>
            function toggleFullscreen() {
              const iframe = document.getElementById("ytPlayer");
              if (iframe.requestFullscreen) iframe.requestFullscreen();
              else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
              else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
              else alert("Fullscreen not supported.");
            }
          </script>
        </body>
      </html>
    `,
    contentType: "text/html",
    title: `YouTube Video - ${displayTitle}`
  };
}

/**
 * Render homepage with optional search results
 */
async function getMergedSearchPageHTML(query = "", limit = 10) {
  const dynamicList = query
    ? (await ytSearch(query)).videos.slice(0, limit).map((v) => ({
        id: `yt:${v.videoId}`,
        title: v.title,
        thumbnail: v.thumbnail,
        channel: v.author.name,
        duration: v.timestamp,
        description: v.description
      }))
    : [];

  const list = [...dynamicList, ...(!query ? staticVideos : [])];
  const heading = query ? `🔍 Results for "${query}"` : "🎞️ Video Catalog";

  return {
    contentType: "text/html",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>${heading}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="${icon}" />
          <script type="module" src="https://cdn.jsdelivr.net/npm/lite-youtube-embed@0.2.0/+esm"></script>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lite-youtube-embed@0.2.0/src/lite-yt-embed.css" />
          <style>
            body {
              font-family: sans-serif;
              background: #f5f5f5;
              margin: 0;
              padding: 1rem;
            }
            h1 { text-align: center; }
            form {
              max-width: 600px;
              margin: 0 auto 2rem;
              display: flex;
              gap: 0.5rem;
            }
            input[type="text"] {
              flex: 1;
              padding: 0.5rem 1rem;
              font-size: 1rem;
              border: 1px solid #ccc;
              border-radius: 4px;
            }
            button {
              padding: 0.5rem 1rem;
              font-size: 1rem;
              background: black;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            .video-list {
              max-width: 800px;
              margin: auto;
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }
            .video-item {
              background: white;
              border-radius: 8px;
              padding: 1rem;
              display: flex;
              gap: 1rem;
              box-shadow: 0 0 5px rgba(0,0,0,0.05);
            }
            .video-thumb img, lite-youtube {
              width: 160px;
              height: 90px;
              border-radius: 4px;
              display: block;
            }
            .video-info h3 { margin: 0 0 0.5rem; }
            .video-info p { margin: 0.2rem 0; color: #666; }
            a { color: black; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>${heading}</h1>
          <form method="GET" action="/">
            <input type="text" name="q" placeholder="Search YouTube..." value="${query || ""}" />
            <button type="submit">Search</button>
          </form>
          <div class="video-list">
            ${list.map((v) => `
              <div class="video-item">
                <a class="video-thumb" href="/stream/${v.id}?q=${encodeURIComponent(query)}">
                  ${
                    v.id.startsWith("yt:") && v.thumbnail?.includes("ytimg")
                      ? `<lite-youtube videoid="${v.id.slice(3)}" playlabel="${v.title}"></lite-youtube>`
                      : `<img src="${v.thumbnail}" alt="${v.title}" />`
                  }
                </a>
                <div class="video-info">
                  <h3><a href="/stream/${v.id}?q=${encodeURIComponent(query)}">${v.title}</a></h3>
                  <p>${v.channel || "Unknown"} • ${v.duration || ""}</p>
                  <p>${v.description || ""}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </body>
      </html>
    `
  };
}

module.exports = { getYouTubeStream, getMergedSearchPageHTML };