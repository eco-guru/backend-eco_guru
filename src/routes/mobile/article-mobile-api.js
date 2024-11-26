// app.get("/articles", async (req, res) => {
//     try {
//       const data = await pool.query(`SELECT a.*, COUNT(l.accessed_by) as views FROM ARTICLES a LEFT JOIN LOG_ARTICLES l ON a.article_id = l.article_id WHERE a.is_published = $1 GROUP BY a.article_id, a.title`, [true]);
//       const articles = data.rows;
//       res.status(200).json({
//         message: "Artikel berhasil didapatkan",
//         articles: articles
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Terjadi kesalahan saat mengambil artikel" });
//     }
//   });

// app.post("/trigger-articles", async (req, res) => {
//     const { token, title } = req.body;
  
//     try {
//       const secret_key = process.env.SECRET_KEY;
//       const data = token === "VISITOR" ? "" : jwt.verify(token, secret_key);
//       const userId = token === "VISITOR" ? "" : data.id;
  
//       const articleData = await pool.query("SELECT article_id FROM ARTICLES WHERE title = $1", [title]);
  
//       if(token !== "VISITOR") {
//         const articleId = articleData.rows[0].article_id;
//         await pool.query("INSERT INTO LOG_ARTICLES (article_id, accessed_by, accessed_time) VALUES ($1, $2, CURRENT_TIMESTAMP)", [articleId, userId]);
//       }
//       res.status(200).json({
//         message: "Silahkan membaca artikel",
//       });
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ message: "Terjadi kesalahan saat membaca artikel" });
//     }
//   });