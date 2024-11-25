import express from 'express';
import userController from '../../controller/user-controller.js';

export const authMobileRouter = express.Router();

authMobileRouter.post('/register', userController.register);
authMobileRouter.post('/login', userController.login);