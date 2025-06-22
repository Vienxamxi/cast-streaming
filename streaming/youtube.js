const { icon, videos } = require("../index");

/**
 * Generate an HTML page to stream a single YouTube video via iframe.
 * Accepts optional subtitle array (for future video player support).
 */
function getYouTubeStream(videoId, displayTitle = "", subtitles = []) {
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return {
    redirectUrl: `https://www.youtube.com/watch?v=${videoId}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${displayTitle}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 0;
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
              top: 0; left: 0;
              width: 100%; height: 100%;
              background: rgba(0, 0, 0, 0.5);
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
              box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
            }
            .controls {
              z-index: 1;
              margin-top: 1rem;
              display: flex;
              gap: 1rem;
            }
            button {
              padding: 0.5rem 1rem;
              font-size: 1rem;
              border: none;
              background-color: rgba(255,255,255,0.1);
              color: white;
              border-radius: 4px;
              cursor: pointer;
              transition: background 0.3s ease;
            }
            button:hover {
              background-color: rgba(255,255,255,0.3);
            }
          </style>
        </head>
        <body>
          <div class="overlay"></div>
          <h1>🎬 ${displayTitle}</h1>
          <iframe id="ytPlayer" width="640" height="360"
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
            title="${displayTitle}" allow="autoplay; encrypted-media"
            allowfullscreen>
          </iframe>
          <div class="controls">
            <button onclick="window.history.back()">🔙 Back</button>
            <button onclick="toggleFullscreen()">🖥️ Fullscreen</button>
          </div>
          <script>
            function toggleFullscreen() {
              const iframe = document.getElementById('ytPlayer');
              if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
              } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
              } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
              } else {
                alert("Fullscreen is not supported by your browser.");
              }
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
 * Generate a simple HTML page displaying a list of all videos
 * in a YouTube search-style layout.
 */
function getYouTubeSearchPageHTML() {
  return {
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>YouTube Search Results</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="icon" href="${icon}">
          <style>
            body {
              font-family: sans-serif;
              background: #f2f2f2;
              margin: 0;
              padding: 1rem;
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
              box-shadow: 0 0 5px rgba(0,0,0,0.1);
            }
            .video-thumb img {
              width: 160px;
              border-radius: 4px;
            }
            .video-info h3 {
              margin: 0 0 0.5rem;
            }
            .video-info p {
              margin: 0.2rem 0 0;
              color: #666;
            }
            .video-info a {
              text-decoration: none;
              color: black;
            }
            .video-info a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <h1 style="text-align:center">🔍 Search Results</h1>
          <div class="video-list">
            ${videos.map(v => `
              <div class="video-item">
                <a class="video-thumb" href="/stream/${v.id}">
                  <img src="${v.thumbnail}" alt="${v.title}">
                </a>
                <div class="video-info">
                  <h3><a href="/stream/${v.id}">${v.title}</a></h3>
                  <p>${v.channel} • ${v.duration}</p>
                  <p>${v.description}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </body>
      </html>
    `,
    contentType: "text/html"
  };
}

module.exports = { getYouTubeStream, getYouTubeSearchPageHTML };