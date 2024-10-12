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


userRouter.post('/api/uom/create', uomController.createUOM);
userRouter.put('/api/uom/update/:id', uomController.updateUOM);
userRouter.delete('/api/uom/delete/:id', uomController.deleteUOM);
userRouter.get('/api/uom/get-one/:id', uomController.getOneUOM);
userRouter.get('/api/uom/get', uomController.getUOM);



userRouter.post('/api/waste-category/create', wasteCategoryController.createWasteCategory);
userRouter.put('/api/waste-category/update/:id', wasteCategoryController.updateWasteCategory);
userRouter.delete('/api/waste-category/delete/:id', wasteCategoryController.deleteWasteCategory);
userRouter.get('/api/waste-category/get-one/:id', wasteCategoryController.getOneWasteCategory);
userRouter.get('/api/waste-category/get', wasteCategoryController.getWasteCategory);


userRouter.get('/api/pricelist/get', pricelistController.getPricelist);
userRouter.get('/api/pricelist/get-one/:wasteId/:uomId', pricelistController.getOne);
userRouter.post('/api/pricelist', pricelistController.postPricelist);
userRouter.patch('/api/pricelist/update', pricelistController.updatePricelist);
userRouter.delete('/api/pricelist/delete/:wasteId/:uomId', pricelistController.deletePricelist);


export {
    userRouter
}
