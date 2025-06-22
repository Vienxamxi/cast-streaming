const config = require("./index");
const { getYouTubeStream, getYouTubeSearchPageHTML } = require("./streaming/youtube");

const dataset = {};

// Build internal dataset from config.videos
(config.videos || []).forEach((video) => {
  const id = video.id || `yt:${video.ytId}`;
  if (!id || !video.ytId) return;

  dataset[id] = {
    name: video.title || "Untitled Video",
    type: video.type || "other",
    sources: [
      {
        ytId: video.ytId,
        displayTitle: video.displayTitle || video.title || video.ytId,
        sourceName: video.sourceName || "YouTube",
        channel: video.channel || "Unknown",
        duration: video.duration || null,
        thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.ytId}/hqdefault.jpg`,
        quality: video.quality || null,
        size: video.size || null,
        audio: video.audio || ["Unknown"],
        subtitles: video.subtitles || []
      }
    ]
  };
});

// Stream handler
function addonBuilder() {
  const streams = {};
  for (const id in dataset) {
    const source = dataset[id].sources[0];
    streams[id] = () =>
      getYouTubeStream(source.ytId, source.displayTitle, source.subtitles || []);
  }

  return {
    get: (id) => streams[id]?.() || null
  };
}

module.exports = {
  addonBuilder,
  html: {
    getYouTubeStream,
    getYouTubeSearchPageHTML
  },
  dataset
};