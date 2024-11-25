import express from 'express';
import userController from '../../controller/user-controller.js';

export const authMobileRouter = express.Router();

authMobileRouter.post('/register', userController.register);
authMobileRouter.post('/login', userController.mobileLogin);
authMobileRouter.post('/verification', userController.verification);
authMobileRouter.post('/verify', userController.verifyWithQuestion);
authMobileRouter.post('/reset-password', userController.resetPassword);
  
//   app.post("/reset-login-password", async (req, res) => {
//     const {token, oldPassword, password} = req.body;
  
//     try {
//       const secret_key = process.env.SECRET_KEY;
//       const data = jwt.verify(token, secret_key);
//       const id = data.id;
  
//       const result = await pool.query("SELECT password FROM USERS WHERE user_id = $1", [id]);
//       const user = result.rows[0];
//       const match = await bcrypt.compare(oldPassword, user.password);
//       if (!match) {
//         return res.status(400).json({ message: "Password yang kamu masukkan salah!", wrongPassword: true });
//       }
  
//       const hashedNewPassword = await bcrypt.hash(password, 10);
//       await pool.query("UPDATE USERS SET password = $1 WHERE user_id = $2",[hashedNewPassword, id]);
//       res.status(200).json({message: "Password mu berhasil diubah!"});
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({message: "Terjadi kesalahan server saat mengubah password"})
//     }
//   })