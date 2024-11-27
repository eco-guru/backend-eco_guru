import express from 'express';
import userController from '../../controller/user-controller.js';
import { questionController } from '../../controller/question-controller.js';

export const authMobileRouter = express.Router();

authMobileRouter.post('/register', userController.register);
authMobileRouter.post('/login', userController.mobileLogin);

authMobileRouter.post('/verification', userController.verification);
authMobileRouter.post('/verify', userController.verifyWithQuestion);
authMobileRouter.post('/reset-password', userController.resetPassword);

authMobileRouter.get('/profile/:token', userController.getUserProfile);
authMobileRouter.put('/edit-profile/:token', userController.updateMobile);
authMobileRouter.post('/reset-login-password', userController.resetPasswordAuthenticated);

authMobileRouter.get('/home/:token', userController.getUserBalance);
authMobileRouter.get('/users/username/:username', userController.getUserMobileByUsername);
authMobileRouter.get('/users/all/', userController.getUserMobile);
authMobileRouter.get('/users/phone/:phone', userController.getUserByPhoneNumber);

authMobileRouter.get('/list-question', questionController.getQuestion);

authMobileRouter.get('/waste-collector-home-data/:token', userController.getWasteCollectorData);
  
//   app.post("/edit-photo/:token", async (req, res) => {
//     const { token } = req.params;
//     const { uri, name, type } = req.body;
  
//     try {
//       const secret_key = process.env.SECRET_KEY;
//       const data = jwt.verify(token, secret_key);
//       const id = data.id;
  
//       const userResult = await pool.query("SELECT * FROM USERS WHERE user_id = $1", [id]);
//       if (userResult.rows.length === 0) {
//         return res.status(404).json({ message: "Pengguna tidak ditemukan" });
//       }
  
//       const base64Data = uri.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
//       const buffer = Buffer.from(base64Data, 'base64');
//       const filename = `${Date.now()}-${name}-${userResult.rows[0].user_id}-${userResult.rows[0].username}.${type.split("/")[1]}`;
//       const filePath = path.join(__dirname, 'photoProfile', filename);
      
//       // Simpan gambar ke file system
//       fs.writeFile(filePath, buffer, (err) => {
//         if (err) {
//           console.error("Gagal menyimpan gambar:", err);
//           return res.status(500).json({ message: "Gagal menyimpan gambar" });
//         }
//         console.log("Gambar berhasil disimpan di:", filePath);
//       });
//       await pool.query("UPDATE USERS SET profile_picture = $1 WHERE user_id = $2", [filename, userResult.rows[0].user_id]);
//       res.status(200).json({ message: "Profil berhasil diperbarui" });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Terjadi kesalahan saat memperbarui profil" });
//     }
//   });