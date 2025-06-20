const config = {
  icon: "https://www.youtube.com/s/desktop/f8fbb2fa/img/favicon_144x144.png", // favicon của YouTube

  // Danh sách video để hiển thị như trang tìm kiếm YouTube
  videos: [
    {
      id: "yt:dQw4w9WgXcQ",
      ytId: "dQw4w9WgXcQ",
      title: "Rick Astley - Never Gonna Give You Up",
      description: "Official Music Video (1987)",
      channel: "Rick Astley",
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg`,
      duration: "3:33"
    },
    // 👉 Thêm nhiều video khác tại đây nếu muốn
  ]
};

module.exports = config;