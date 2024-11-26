// app.get("/videos", async (req, res) => {
//     try {
//       const data = await pool.query(`SELECT v.*, COUNT(l.accessed_by) as views FROM VIDEOS v LEFT JOIN LOG_VIDEOS l ON v.video_id = l.video_id WHERE v.is_active = $1 GROUP BY v.video_id, v.title`,[true]);
//       const videos_data = data.rows;
//       const videos = videos_data.map((value) => {return {...value, url: `https://www.youtube.com/embed/${value.url.replace('https://youtu.be/', '')}`}});
//       res.status(200).json({
//         message: "Artikel berhasil didapatkan",
//         videos: videos
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Terjadi kesalahan saat mengambil artikel" });
//     }
//   });

// app.post("/trigger-videos", async (req, res) => {
//     const { token, title } = req.body;
  
//     try {
//       const secret_key = process.env.SECRET_KEY;
//       const data = token === "VISITOR" ? "" : jwt.verify(token, secret_key);
//       const userId = token === "VISITOR" ? "" : data.id;
  
//       const videoData = await pool.query("SELECT video_id FROM VIDEOS WHERE title = $1", [title]);
  
//       if(token !== "VISITOR") {
//         const videoId = videoData.rows[0].video_id;
//         await pool.query("INSERT INTO LOG_VIDEOS (video_id, accessed_by, accessed_time) VALUES ($1, $2, CURRENT_TIMESTAMP)", [videoId, userId]);
//       }
//       res.status(200).json({
//         message: "Silahkan menonton video",
//       });
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ message: "Terjadi kesalahan saat membaca video" });
//     }
//   });