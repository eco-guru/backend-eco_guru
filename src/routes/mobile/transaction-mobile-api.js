import express from 'express'
import wasteTypeController from '../../controller/wasteType-controller.js';
import transactionController from '../../controller/transaction-controller.js';
import paymentRequestController from '../../controller/payment-request-controller.js';

export const transactionMobileRouter = express.Router();

transactionMobileRouter.get('/waste-types', wasteTypeController.getWasteTypeMobile);

transactionMobileRouter.post('/transactions', transactionController.createTransactionMobile);
transactionMobileRouter.get('/transaction-history/:token', transactionController.getTransactionByToken);

transactionMobileRouter.post('/disbursement/:token', paymentRequestController.createMobilePaymentRequest);
transactionMobileRouter.put('/give-disbursement-confirmation/:token', paymentRequestController.giveConfirmation);
transactionMobileRouter.get('/get-all-disbursement', paymentRequestController.get);
transactionMobileRouter.get('/history-disbursement/:token', paymentRequestController.getMobilePayerById);
transactionMobileRouter.put('/accept-disbursement/:token')
transactionMobileRouter.put('/decline-disbursement', paymentRequestController.decline);

transactionMobileRouter.get('/waste-collector-home-data/:token')
transactionMobileRouter.get('/report/:token')
transactionMobileRouter.get('/report-specify/:token')
  
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