import userService from "../services/user-service.js";
import bcrypt from "bcrypt";


const register = async (req, res) => {
    try {
        console.log(req.body);
        const result = await userService.register(req.body);
        return res.status(200).json({
            data: result,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Terjadi kesalahan saat registrasi" });
    }
}

const mobileLogin = async (req, res) => {
  try {
    const user = await userService.mobileLogin(req.body);

    if (user) {
      return res.status(200).json({
        message: 'Login berhasil',
        token: user.token,
        user: {role: user.user.role}
      });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    return res.status(500).json({message: err.message });
  }
}

const verification = async (req, res) => {
  try {
    const question = await userService.verification(req.body); 
    if (question && !question.error) {
      return res.status(200).json(question);
    } else if(question.error) {
      return res.status(401).json({ message: 'Nomor telepon tidak ditemukan' });
    }
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server, silahkan coba lagi" });
  }
}

const verifyWithQuestion = async (req, res) => {
  try {
    const validate = await userService.proofUser(req.body, res);
    return validate;
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan saat verifikasi pengguna" });
  }
}

const resetPassword = async (req, res) => {
  try {
    const reset = userService.resetPassword(req.body);
    return res.status(200).json({message: "Password mu berhasil diubah. Silahkan lakukan login", reset: reset});
  } catch (e) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server, silahkan coba lagi"})
  }
}

const resetPasswordAuthenticated = async (req, res) => {
  try {
    const reset = userService.resetPasswordAuthenticated(req.body, res);
    return reset;
  } catch (e) {
    return res.status(500).json({message: "Terjadi kesalahan saat memperbarui profil"});
  }
}

const login = async (req, res) => {
    try {
        const user = await userService.login(req.body);
        const data = await bcrypt.hash(user.role, 10);

      if (user) {
        res.cookie('user-role', data, {
          httpOnly: true,
          maxAge: 2 * 60 * 60 * 1000,
          domain: 'localhost',
          secure: true,
          sameSite: 'Lax',
        });
  
        return res.status(200).json({
          message: 'Login successful',
          user: user
        });
      } else {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (err) {
      return res.status(500).json({message: err.message });
    }
};

const getUserBalance = async (req, res) => {
  try {
    const user = await userService.getUserByToken(req.params.token);
    return res.status(200).json({ balance: user.balance });
  } catch (e) {
    return res.status(500).json({message: "Terjadi kesalahan saat mengambil data beranda"});
  }
}

const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserByToken(req.params.token);
    return res.status(200).json({
      message: "Profil pengguna berhasil diambil",
      data: {
        username: user.username,
        phone: user.phone,
        profile_picture: user.profile_picture
      }
    })
  } catch (err) {
    return res.status(500).json({message: "Terjadi kesalahan saat mengambil profil"});
  }
}

const get = async (req, res, next) => {
    try {
      const result = await userService.get();
      res.status(200).json({
        data: result
      });
    } catch (e) {
      next(e);
    }
}

const update = async (req, res, next) => {
    try {
      const username = req.user.username;
      const request = req.body;
      let profile_picture = null;
        if (req.file) {
            profile_picture = req.file.buffer;
        }

  
      const result = await userService.update(username, request, profile_picture);
      res.status(200).json({
        data: result
      });
    } catch (e) {
      next(e);
    }
}

const updateMobile = async (req, res) => {
  try {
    const user = await userService.updateMobile(req.body, req.params.token);
    if(user.id) return res.status(200).json({message: "Profil berhasil diperbarui"});
    else return res.status(404).json({message: "Pengguna tidak ditemukan"});
  } catch (e) {
    return res.status(500).json({ message: "Terjadi kesalahan saat memperbarui profil"});
  }
}

const logout = async (req, res, next) => {
    try {
        await userService.logout(req.user.username);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

const getCurrent = async (req, res, next) => {
    try {
        const username = req.user.username;
        const result = await userService.getCurrent(username);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getUserByUsername = async (req, res) => {
    try {
      const username = req.query.username; 
      const user = await userService.getUserByUsername(username);
  
      if (user) {
        return res.status(200).json({ message: 'User found', user });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
};

const updateUserByUsername = async (req, res) => {
    const { username } = req.query; // Mengambil username dari query parameter

    // Mengambil data yang ingin diupdate
    const updateData = req.body;

    try {
        const updatedUser = await userService.updateUser(username, updateData);
        return res.json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: 'Bad Request',
            error: err.message,
        });
    }
};

export default {
    get,
    update,
    login,
    mobileLogin,
    register,
    verification,
    verifyWithQuestion, 
    resetPassword,
    resetPasswordAuthenticated,
    logout,
    getCurrent,
    getUserByUsername,
    updateUserByUsername,
    getUserBalance,
    getUserProfile,
    updateMobile
}