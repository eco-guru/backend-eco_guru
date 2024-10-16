import express from "express";
import userController from "../controller/user-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import pricelistController from "../controller/pricelist-controller.js";
import uomController from '../controller/uom-controller.js';
import wasteCategoryController from "../controller/wasteCategory-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get('/api/users/current', userController.getCurrent);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

userRouter.get('/api/uom/get-one/:id', uomController.getOneUOM);
userRouter.get('/api/uom/get', uomController.getUOM);

userRouter.get('/api/waste-category/get-one/:id', wasteCategoryController.getOneWasteCategory);
userRouter.get('/api/waste-category/get', wasteCategoryController.getWasteCategory);


userRouter.get('/api/pricelist/get', pricelistController.getPricelist);
userRouter.get('/api/pricelist/get-one/:wasteId/:uomId', pricelistController.getOne);



export {
    userRouter
}
