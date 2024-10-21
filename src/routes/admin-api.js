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

adminRouter.post('/api/uom/create', uomController.createUOM);
adminRouter.put('/api/uom/update/:id', uomController.updateUOM);
adminRouter.delete('/api/uom/delete/:id', uomController.deleteUOM);

adminRouter.post('/api/pricelist', pricelistController.postPricelist);
adminRouter.patch('/api/pricelist/update', pricelistController.updatePricelist);
adminRouter.delete('/api/pricelist/delete/:wasteId/:uomId', pricelistController.deletePricelist);

adminRouter.post('/api/waste-category/create', wasteCategoryController.createWasteCategory);
adminRouter.put('/api/waste-category/update/:id', wasteCategoryController.updateWasteCategory);
adminRouter.delete('/api/waste-category/delete/:id', wasteCategoryController.deleteWasteCategory);

export {
    adminRouter
}