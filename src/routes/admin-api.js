import express from "express";
import userController from "../controller/user-controller.js";
import pricelistController from "../controller/pricelist-controller.js";
import uomController from '../controller/uom-controller.js';
import wasteCategoryController from "../controller/wasteCategory-controller.js";
import {adminMiddleware} from "../middleware/admin-middleware.js";

const adminRouter = new express.Router();

adminRouter.use(adminMiddleware);

adminRouter.get('/api/admin/users', userController.get);
adminRouter.get('/api/admin/users/get-one', userController.getUserByUsername);
adminRouter.patch('/api/admin/user/update', userController.updateUserByUsername);

userRouter.post('/api/uom/create', uomController.createUOM);
userRouter.put('/api/uom/update/:id', uomController.updateUOM);
userRouter.delete('/api/uom/delete/:id', uomController.deleteUOM);

adminRouter.post('/api/pricelist', pricelistController.postPricelist);
adminRouter.patch('/api/pricelist/update', pricelistController.updatePricelist);
adminRouter.delete('/api/pricelist/delete/:wasteId/:uomId', pricelistController.deletePricelist);

userRouter.post('/api/waste-category/create', wasteCategoryController.createWasteCategory);
userRouter.put('/api/waste-category/update/:id', wasteCategoryController.updateWasteCategory);
userRouter.delete('/api/waste-category/delete/:id', wasteCategoryController.deleteWasteCategory);

export {
    adminRouter
}