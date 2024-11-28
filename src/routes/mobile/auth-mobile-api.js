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
authMobileRouter.post('/edit-photo/:token', userController.updatePhoto);

authMobileRouter.get('/list-question', questionController.getQuestion);

authMobileRouter.get('/waste-collector-home-data/:token', userController.getWasteCollectorData);