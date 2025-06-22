const config = require("./index"); // User-defined file for videos[] and icon
const { getYouTubeStream, getYouTubeSearchPageHTML } = require("./streaming/youtube");

const dataset = {};

// ✅ Generate dataset using format "yt:<id>"
(config.videos || []).forEach((v) => {
  const id = v.id || `yt:${v.ytId}`;
  if (!id || !v.ytId) return;

  dataset[id] = {
    name: v.title || "Untitled Video",
    type: v.type || "other",
    sources: [
      {
        ytId: v.ytId,
        displayTitle: v.displayTitle || v.title || v.ytId,
        sourceName: v.sourceName || "YouTube",
        channel: v.channel || "Unknown",
        duration: v.duration || null,
        thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.ytId}/hqdefault.jpg`,
        quality: v.quality || null,
        size: v.size || null,
        audio: v.audio || ["Unknown"],
        subtitles: v.subtitles || []
      }
    ]
  };
});

// ✅ Create addonBuilder: returns function to get stream by ID
function addonBuilder() {
  const streams = {};

  for (const id in dataset) {
    const src = dataset[id]?.sources?.[0];
    if (!src?.ytId) continue;

    streams[id] = () =>
      getYouTubeStream(src.ytId, src.displayTitle, src.subtitles || []);
  }

  return {
    get: (id) => streams[id]?.() || null
  };
}

// ✅ Export for external use
module.exports = {
  addonBuilder,
  html: {
    getYouTubeStream,
    getYouTubeSearchPageHTML
  },
  dataset
};
