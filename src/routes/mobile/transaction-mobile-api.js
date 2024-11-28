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

transactionMobileRouter.get('/report/:token', transactionController.getUserTransactionReport);
transactionMobileRouter.get('/report-specify/:token', transactionController.getUserReportSpecify);
  
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