import express from "express";
import multer from "multer";
import userController from "../../controller/user-controller.js";
import pricelistController from "../../controller/pricelist-controller.js";
import uomController from '../../controller/uom-controller.js';
import wasteCategoryController from "../../controller/wasteCategory-controller.js";
import {adminMiddleware} from "../../middleware/admin-middleware.js";
import transactionController from "../../controller/transaction-controller.js";
import transactionDataController from "../../controller/transaction-data-controller.js";
import wasteTypeController from "../../controller/wasteType-controller.js";
import articleController from "../../controller/article-controller.js";
import logArticleController from "../../controller/logArticle-controller.js";
import videosController from "../../controller/videos-controller.js";
import logVideosController from "../../controller/logVideos-controller.js";
import paymentRequestController from "../../controller/payment-request-controller.js";
import wastePickupController from "../../controller/waste-pickup-controller.js";
import dashboardController from "../../controller/dashboard-controller.js";

const adminRouter = new express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

adminRouter.use(adminMiddleware);

adminRouter.get('/api/admin/users', userController.get);
adminRouter.get('/api/admin/users/get-one', userController.getUserByUsername);
adminRouter.patch('/api/admin/user/update', userController.updateUserByUsername);
adminRouter.post('/api/create/user',upload.single('profile_picture'), userController.postCreateUser);

adminRouter.get('/api/uom/get-one/:id', uomController.getOneUOM);
adminRouter.get('/api/uom/get', uomController.getUOM);
adminRouter.post('/api/uom/create', uomController.createUOM);
adminRouter.put('/api/uom/update/:id', uomController.updateUOM);
adminRouter.delete('/api/uom/delete/:id', uomController.deleteUOM);

adminRouter.get('/api/pricelist/get', pricelistController.getPricelist);
adminRouter.get('/api/pricelist/get-one/:wasteTypeId/:uomId', pricelistController.getOne);
adminRouter.post('/api/pricelist', pricelistController.postPricelist);
adminRouter.put('/api/pricelist/update/:wasteTypeId/:uomId', pricelistController.updatePricelist);
adminRouter.delete('/api/pricelist/delete/:wasteTypeId/:uomId', pricelistController.deletePricelist);

adminRouter.get('/api/waste-category/get-one/:id', wasteCategoryController.getOneWasteCategory);
adminRouter.get('/api/waste-category/get', wasteCategoryController.getWasteCategory);
adminRouter.post('/api/waste-category/create', wasteCategoryController.createWasteCategory);
adminRouter.put('/api/waste-category/update/:id', wasteCategoryController.updateWasteCategory);
adminRouter.delete('/api/waste-category/delete/:id', wasteCategoryController.deleteWasteCategory);

adminRouter.get('/api/waste-type/get-one/:id', wasteTypeController.getOneWasteType);
adminRouter.get('/api/waste-type/get', wasteTypeController.getWasteType);
adminRouter.post('/api/waste-type/create', wasteTypeController.createWasteType);
adminRouter.put('/api/waste-type/update/:id', wasteTypeController.updateWasteType);
adminRouter.delete('/api/waste-type/delete/:id', wasteTypeController.deleteWasteType);

adminRouter.post('/api/transaction/create', transactionController.createTransaction);
adminRouter.put('/api/transaction/update/:id', transactionController.updateTransaction);
adminRouter.get('/api/transaction/list', transactionController.listAllTransactions);
adminRouter.get('/api/transaction/getOne/:id', transactionController.getTransactionById);
adminRouter.delete('/api/transaction/delete/:id', transactionController.deleteTransaction);

adminRouter.post('/api/transactionData/create', transactionDataController.createTransactionData);
adminRouter.put('/api/transactionData/update/:Id', transactionDataController.updateTransactionData);
adminRouter.get('/api/transactionData/list', transactionDataController.listAllTransactionData);
adminRouter.get('/api/transactionData/getOne/:Id', transactionDataController.getTransactionDataById);
adminRouter.delete('/api/transactionData/delete/:Id', transactionDataController.deleteTransactionData);

adminRouter.post('/api/article/create', articleController.createArticles);
adminRouter.put('/api/article/update/:id', articleController.updateArticles);
adminRouter.get('/api/article/list', articleController.getArticles);
adminRouter.get('/api/article/getOne/:id', articleController.getOneArticles);
adminRouter.delete('/api/article/delete/:id', articleController.deleteArticles);

adminRouter.post('/api/log-article/create', logArticleController.createLogArticles);
adminRouter.put('/api/log-article/update/:article_id/:accessed_by', logArticleController.updateLogArticles);
adminRouter.get('/api/log-article/list', logArticleController.getLogArticles);
adminRouter.get('/api/log-article/getOne/:article_id/:accessed_by', logArticleController.getOneLogArticles);
adminRouter.delete('/api/log-article/delete/:article_id/:accessed_by', logArticleController.deleteLogArticles);

adminRouter.post('/api/videos/create', videosController.createVideos);
adminRouter.put('/api/videos/update/:id', videosController.updateVideos);
adminRouter.get('/api/videos/list', videosController.getVideos);
adminRouter.get('/api/videos/getOne/:id', videosController.getOneVideos);
adminRouter.delete('/api/videos/delete/:id', videosController.deleteVideos);

adminRouter.post('/api/log-videos/create', logVideosController.createLogVideos);
adminRouter.put('/api/log-videos/update/:video_id/:accessed_by', logVideosController.updateLogVideos);
adminRouter.get('/api/log-videos/list', logVideosController.getLogVideos);
adminRouter.get('/api/log-videos/getOne/:video_id/:accessed_by', logVideosController.getOneLogVideos);
adminRouter.delete('/api/log-videos/delete/:video_id/:accessed_by', logVideosController.deleteLogVideos);

adminRouter.get('/api/count/articles/:articleId/:option', logArticleController.countArticles);


adminRouter.get("/api/payment-requests", paymentRequestController.get);
adminRouter.get("/api/payment-requests/:paymentRequestId", paymentRequestController.getById);
adminRouter.post("/api/payment-requests", paymentRequestController.create);
adminRouter.put("/api/payment-requests/:paymentRequestId", paymentRequestController.update);
adminRouter.delete("/api/payment-requests/:paymentRequestId", paymentRequestController.remove);

adminRouter.get('/api/waste-pickups', wastePickupController.getAllWastePickups);
adminRouter.get('/api/waste-pickups/:id', wastePickupController.getOneWastePickup);
adminRouter.post('/api/waste-pickups', wastePickupController.createWastePickup);
adminRouter.put('/api/waste-pickups/:id', wastePickupController.updateWastePickup);
adminRouter.delete('/api/waste-pickups/:id', wastePickupController.deleteWastePickup);

adminRouter.get('/api/dashboard', dashboardController.DashboardController);


export {
    adminRouter
}
