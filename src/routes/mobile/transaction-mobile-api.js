import express from 'express'

export const transactionMobileRouter = express.Router();
  
//   app.get("/waste-price/:wasteId", async (req, res) => {
//     const { wasteId } = req.params;
//     try {
//       const result = await pool.query("SELECT * FROM PRICELIST WHERE waste_id = $1 AND is_active = true", [wasteId]);
//       if (result.rows.length === 0) {
//         return res.status(404).json({ message: "Harga sampah tidak ditemukan" });
//       }
//       res.status(200).json(result.rows[0]);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Terjadi kesalahan saat mengambil harga sampah" });
//     }
//   });
  
//   app.get("/waste-types", async (req, res) => {
//     try {
//       const result = await pool.query(`SELECT 
//         WASTE_TYPE.waste_type_id,
//         WASTE_TYPE.waste_category,
//         WASTE_TYPE.price,
//         WASTE_TYPE.waste_name,
//         UOM.unit_name,
//         UOM.uom_id
//         FROM WASTE_TYPE
//         INNER JOIN UOM 
//         ON WASTE_TYPE.uom_id = UOM.uom_id;
//       `);
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Terjadi kesalahan saat mengambil jenis sampah" });
//     }
//   });
  
//   app.post("/transactions", async (req, res) => {
//     const { username, totalAmount, approvedByUsername, transactionData } = req.body;
    
//     const client = await pool.connect();
//     try {
//       await client.query("BEGIN");
  
//       const user = await client.query("SELECT user_id, balance FROM USERS WHERE username = $1", [username]);
//       const { user_id, balance } = user.rows[0];
//       const updateBalance = balance + totalAmount;
  
//       const userApproved = await client.query("SELECT user_id FROM USERS WHERE username = $1", [approvedByUsername]);
//       const approvedBy = userApproved.rows[0].user_id;
  
//       await client.query("UPDATE USERS SET balance = $1 WHERE user_id = $2", [updateBalance, user_id]);
  
//       const transactionResult = await client.query(
//         "INSERT INTO TRANSACTIONS (user_id, transaction_date, total_amount, approved_by) VALUES ($1, CURRENT_TIMESTAMP, $2, $3) RETURNING transaction_id",
//         [user_id, totalAmount, approvedBy]
//       );
      
//       const transactionId = transactionResult.rows[0].transaction_id;
//       const insertPromises = JSON.parse(transactionData).map(item => {
//         return client.query(
//           "INSERT INTO TRANSACTION_DATA (transaction_id, waste_name, waste_category, uom_id, quantity, price) VALUES ($1, $2, $3, $4, $5, $6)",
//           [transactionId, item.waste_name, item.waste_category, item.uom_id, item.amount, item.price]
//         );
//       });
  
//       await Promise.all(insertPromises);
//       await client.query("COMMIT");
      
//       res.status(201).json({ message: "Transaksi berhasil!", transactionId });
//     } catch (error) {
//       await client.query("ROLLBACK");
//       console.error(error);
//       res.status(500).json({ message: "Terjadi kesalahan saat menyimpan transaksi" });
//     } finally {
//       client.release();
//     }
//   });

// app.get("/transaction-history/:token", async (req, res) => {
//     const { token } = req.params;
  
//     try {
//       const secret_key = process.env.SECRET_KEY;
//       const data = jwt.verify(token, secret_key);
//       const userId = data.id;
//       const resultDetail = await pool.query(
//         `SELECT t.transaction_id, td.waste_category, td.waste_name, td.quantity, td.price, u.unit_name
//          FROM TRANSACTIONS t
//          JOIN TRANSACTION_DATA td ON t.transaction_id = td.transaction_id
//          JOIN UOM u ON td.uom_id = u.uom_id
//          WHERE t.user_id = $1
//          ORDER BY t.transaction_date DESC`,
//         [userId]
//       );
  
//       const resultTransaction = await pool.query(
//         `SELECT transaction_id, transaction_date, total_amount
//          FROM TRANSACTIONS
//          WHERE user_id = $1
//          ORDER BY transaction_date DESC`,
//         [userId]
//       );
  
//       if (resultTransaction.rows.length === 0) {  
//         return res.status(404).json({ message: "Tidak ada riwayat transaksi ditemukan", result: false});
//       }
  
//       res.status(200).json({
//         message: "Riwayat transaksi berhasil diambil",
//         transactionsDetail: resultDetail.rows,
//         transactions: resultTransaction.rows,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Terjadi kesalahan saat mengambil riwayat transaksi" });
//     }
//   });

// app.post("/disbursement/:token", async (req, res) => {
//     const { token } = req.params;
//     const { amount } = req.body;
  
//     try {
//       const secret_key = process.env.SECRET_KEY;
//       const data = jwt.verify(token, secret_key);
//       const userId = data.id;
  
//       await pool.query("INSERT INTO PAYMENT_REQUEST (user_id, request_date, request_amount, confirmation_status) VALUES ($1, CURRENT_TIMESTAMP, $2, 'Sedang diproses')", [userId, amount]);
//       res.status(200).json({
//         message: "Permintaan pencairan saldo Anda sudah kami terima dan sedang di proses!",
//       });
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ message: "Pencarian gagal! Pastikan Anda tidak melebihi batas saldo yang anda miliki" });
//     }
//   });
  
//   app.put("/give-disbursement-confirmation/:token", async (req, res) => {
//     const { token } = req.params;
//     const { amount, payment_request_id } = req.body;
  
//     try {
//       const secret_key = process.env.SECRET_KEY;
//       const data = jwt.verify(token, secret_key);
//       const paymentById = data.id;
  
//       const payment = await pool.query("SELECT user_id, confirmation_status FROM PAYMENT_REQUEST WHERE payment_request_id = $1", [payment_request_id]);
//       const userId = payment.rows[0].user_id;
//       const confirmation_status = payment.rows[0].confirmation_status;
  
//       const user = await pool.query("SELECT balance FROM USERS WHERE user_id = $1", [userId]);
//       const userBalance = user.rows[0].balance;
  
//       if(amount > userBalance) {
//         return res.status(400).json({ message: "Pencairan gagal! Saldo yang dimiliki pengguna tidak cukup dengan jumlah yang diajukan" });
//       } else if(confirmation_status !== "Sedang diproses") {
//         return res.status(400).json({ message: "Pencairan gagal! Pencairan telah diajukan" });
//       }
  
//       await pool.query("UPDATE PAYMENT_REQUEST SET confirmation_date = CURRENT_TIMESTAMP, accepted_amount = $1, confirmation_status = 'Ambil uang', payment_by = $2 WHERE payment_request_id = $3", [amount, paymentById, payment_request_id]);
//       return res.status(200).json({
//         message: "Konfirmasi Pencairan saldo sudah dikirimkan!",
//       });
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ message: "Pencarian gagal! Pastikan Anda tidak melebihi batas saldo yang anda miliki" });
//     }
//   });
  
//   app.get('/get-all-disbursement', async (req, res) => {
//     try {
//       const disbursement = await pool.query(
//         "SELECT payment.*, usr.username username, usr2.username payment_by_name FROM PAYMENT_REQUEST payment LEFT JOIN USERS usr ON usr.user_id = payment.user_id LEFT JOIN USERS usr2 ON usr2.user_id = payment.payment_by"
//       );
//       res.status(200).json({
//         disbursement: disbursement.rows,
//       });
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ message: "Terjadi kesalahan server, coba lagi!" });
//     }
//   });
  
//   app.get('/history-disbursement/:token', async (req, res) => {
//     const { token } = req.params;
//     try {
//       const secret_key = process.env.SECRET_KEY;
//       const data = jwt.verify(token, secret_key);
//       const userId = data.id;
  
//       const disbursement = await pool.query(
//         "SELECT payment.*, usr.username username, usr2.username payment_by_name FROM PAYMENT_REQUEST payment LEFT JOIN USERS usr ON usr.user_id = payment.user_id LEFT JOIN USERS usr2 ON usr2.user_id = payment.payment_by WHERE payment.user_id = $1",
//         [userId]
//       );
//       res.status(200).json({
//         disbursement: disbursement.rows,
//       });
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ message: "Pencarian gagal! Pastikan Anda tidak melebihi batas saldo yang anda miliki" });
//     }
//   })
  
//   app.put('/accept-disbursement/:token', async (req, res) => {
//     const { token } = req.params;
//     const { payment_request_id, uri, name, type } = req.body;
  
//     try {
//       const disbursementData = await pool.query('SELECT user_id, accepted_amount FROM PAYMENT_REQUEST WHERE payment_request_id = $1', [payment_request_id]);
//       const userId = disbursementData.rows[0].user_id;
  
//       const secret_key = process.env.SECRET_KEY;
//       const data = jwt.verify(token, secret_key);
//       const paymentBy = data.id;
  
//       const user = await pool.query("SELECT username, balance FROM USERS WHERE user_id = $1", [userId]);
//       const userBalance = user.rows[0].balance;
//       const userName = user.rows[0].username;
  
//       const base64Data = uri.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
//       const buffer = Buffer.from(base64Data, 'base64');
//       const filename = `${Date.now()}-${name}-${userId}-${userName}-${payment_request_id}-${paymentBy}.${type.split("/")[1]}`;
//       const filePath = path.join(__dirname, 'proofVerificationPicture', filename);
  
//       fs.writeFile(filePath, buffer, (err) => {
//         if (err) {
//           console.error("Gagal menyimpan gambar:", err);
//           return res.status(500).json({ message: "Gagal menyimpan gambar" });
//         }
//       });
  
//       const paymentAmount = disbursementData.rows[0].accepted_amount;
  
//       const expenditure = await pool.query("SELECT balance FROM USERS WHERE user_id = $1", [paymentBy]);
//       const expenditureQuantity = expenditure.rows[0].balance;
  
//       await pool.query("UPDATE PAYMENT_REQUEST SET payment_date = CURRENT_TIMESTAMP, confirmation_status = 'Selesai', proof_picture = $1 WHERE payment_request_id = $2", [filename, payment_request_id]);
//       await pool.query("UPDATE USERS SET balance = $1 WHERE user_id = $2", [userBalance - paymentAmount, userId]);
//       await pool.query("UPDATE USERS SET balance = $1 WHERE user_id = $2", [expenditureQuantity + paymentAmount, paymentBy]);
  
//       res.status(200).json({
//         message: "Pencairan berhasil dilakukan! Saldo anda tersisa "+(userBalance - paymentAmount),
//       });
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ message: "Pencarian gagal! Pastikan Anda tidak melebihi batas saldo yang anda miliki" });
//     }
//   });
  
//   app.put('/decline-disbursement', async (req, res) => {
//     const { payment_request_id } = req.body;
//     try {
  
//       await pool.query("UPDATE PAYMENT_REQUEST SET confirmation_status = 'Batal', payment_date = CURRENT_TIMESTAMP WHERE payment_request_id = $1", [payment_request_id]);
  
//       res.status(200).json({
//         message: "Pencairan batal dilakukan!",
//       });
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ message: "Pencarian gagal! Pastikan Anda tidak melebihi batas saldo yang anda miliki" });
//     }
//   });
  
//   app.get('/waste-collector-home-data/:token', async (req, res) => {
//     const { token } = req.params;
//     try {
//       const secret_key = process.env.SECRET_KEY;
//       const data = jwt.verify(token, secret_key);
//       const userId = data.id;
  
//       const user = await pool.query("SELECT SUM(accepted_amount) as balance FROM PAYMENT_REQUEST WHERE payment_by = $1 AND confirmation_status = 'Selesai' AND payment_date >= DATE_TRUNC('month', CURRENT_DATE) AND payment_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'", [userId]);
//       const userBalance = user.rows[0].balance;
  
//       const transactions = await pool.query("SELECT SUM(td.quantity) AS quantity, td.waste_category, u.unit_name FROM TRANSACTIONS t LEFT JOIN TRANSACTION_DATA td ON t.transaction_id = td.transaction_id LEFT JOIN UOM u ON td.uom_id = u.uom_id WHERE t.approved_by = $1 AND t.transaction_date >= DATE_TRUNC('month', CURRENT_DATE) AND t.transaction_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' GROUP BY td.waste_category, u.unit_name", [userId]);
//       res.status(200).json({
//         userBalance: userBalance,
//         transactions: transactions.rows
//       });
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ message: "Pencarian gagal! Pastikan Anda tidak melebihi batas saldo yang anda miliki" });
//     }
//   });
  
//   app.get('/report/:token', async(req, res) => {
//     const { token } = req.params;
//     try {
//       const secret_key = process.env.SECRET_KEY;
//       const data = jwt.verify(token, secret_key);
//       const userId = data.id;
//       const report = await pool.query("SELECT DATE_TRUNC('month', t.transaction_date) AS transaction_month, SUM(td.quantity) AS total_quantity FROM TRANSACTIONS t LEFT JOIN TRANSACTION_DATA td ON t.transaction_id = td.transaction_id LEFT JOIN UOM u ON td.uom_id = u.uom_id WHERE t.user_id = $1 AND u.unit_name = 'Kg' GROUP BY transaction_month, u.unit_name ORDER BY transaction_month", [userId]);
//       const transactions = await pool.query("SELECT SUM(td.quantity) AS quantity, td.waste_category, u.unit_name FROM TRANSACTIONS t LEFT JOIN TRANSACTION_DATA td ON t.transaction_id = td.transaction_id LEFT JOIN UOM u ON td.uom_id = u.uom_id WHERE t.user_id = $1 AND t.transaction_date >= DATE_TRUNC('month', CURRENT_DATE) AND t.transaction_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' GROUP BY td.waste_category, u.unit_name", [userId]);
//       res.status(200).json({
//         report: report.rows,
//         transactions: transactions.rows
//       });
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ message: "Laporan gagal didapatkan!" });
//     }
//   });
  
//   app.get('/report-specify/:token', async(req, res) => {
//     const { token } = req.params;
//     try {
//       const secret_key = process.env.SECRET_KEY;
//       const data = jwt.verify(token, secret_key);
//       const userId = data.id;
  
//       const report = await pool.query("SELECT DATE_TRUNC('month', t.transaction_date) AS transaction_month, td.waste_category, SUM(td.quantity) AS total_quantity FROM TRANSACTIONS t LEFT JOIN TRANSACTION_DATA td ON t.transaction_id = td.transaction_id LEFT JOIN UOM u ON td.uom_id = u.uom_id WHERE t.user_id = $1 GROUP BY transaction_month, td.waste_category ORDER BY transaction_month, td.waste_category", [userId]);
//       res.status(200).json({
//         report: report.rows
//       });
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ message: "Laporan gagal didapatkan!" });
//     }
//   })