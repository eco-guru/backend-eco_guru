import userService from "../services/user-service.js";
import bcrypt from "bcrypt";


const register = async (req, res, next) => {
    try {
        console.log(req.body);
        const result = await userService.register(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
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
  
      const result = await userService.update(username, request);
      res.status(200).json({
        data: result
      });
    } catch (e) {
      next(e);
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
    register,
    logout,
    getCurrent,
    getUserByUsername,
    updateUserByUsername
}