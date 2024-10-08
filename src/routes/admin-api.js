import express from "express";
import userController from "../controller/user-controller.js";
import {adminMiddleware} from "../middleware/admin-middleware.js";

const adminRouter = new express.Router();

adminRouter.use(adminMiddleware);

adminRouter.get('/api/admin/users', userController.get);
adminRouter.get('/api/admin/users/get-one', userController.getUserByUsername);
adminRouter.patch('/api/admin/user/update', userController.updateUserByUsername);


export {
    adminRouter
}