const dataset = require("./dataset");
const {
  getYouTubeStream,
  getMergedSearchPageHTML
} = require("./streaming/youtube");

/**
 * Create addon stream handler using internal dataset (from index.js)
 */
function addonBuilder(data = dataset) {
  const streams = {};

  for (const id in data) {
    const source = data[id]?.sources?.[0];
    if (!source?.ytId) continue;

    streams[id] = () =>
      getYouTubeStream(source.ytId, source.displayTitle, source.subtitles || []);
  }

  return {
    /**
     * Return stream info (html + contentType) by ID
     */
    get: (id) => streams[id]?.() || null
  };
}

module.exports = { addonBuilder, dataset, getYouTubeStream, getMergedSearchPageHTML };