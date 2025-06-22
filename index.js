module.exports = {
  icon: "https://www.youtube.com/s/desktop/f8fbb2fa/img/favicon_144x144.png",
  videos: [
    {
      // Fully customizable fields below
      id: "yt:YOUR_VIDEO_ID",                 // Optional if same as "yt:" + ytId
      ytId: "YOUR_VIDEO_ID",                  // Required
      title: "Your Video Title",              // For search display and dataset
      type: "music",                          // Optional category label (e.g. "music", "movie")
      displayTitle: "Shown in the Player",    // Optional display title in HTML page
      sourceName: "YouTube",                  // Optional: e.g. YouTube, Vimeo, etc.
      channel: "Your Channel Name",           // Optional
      duration: "3:33",                       // Optional: display only
      quality: "HD",                          // Optional info
      size: null,                             // Optional (if known, e.g. "120MB")
      audio: ["English", "Stereo"],           // Optional array of audio tracks or languages
      subtitles: [
        "Subs/en.vtt",
        "Subs/vi.vtt"
      ]                                       // Optional array of subtitle file paths
    }

    // Add more videos as needed...
  ]
};
