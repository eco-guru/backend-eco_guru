import express from "express";
import multer from "multer";
import userController from "../../controller/user-controller.js";
import {authMiddleware} from "../../middleware/auth-middleware.js";
import pricelistController from "../../controller/pricelist-controller.js";
import uomController from '../../controller/uom-controller.js';
import wasteCategoryController from "../../controller/wasteCategory-controller.js";
import transactionController from "../../controller/transaction-controller.js";
import transactionDataController from "../../controller/transaction-data-controller.js";
import wasteTypeController from "../../controller/wasteType-controller.js";
import articleController from "../../controller/article-controller.js";
import logArticleController from "../../controller/logArticle-controller.js";
import videosController from "../../controller/videos-controller.js";
import logVideosController from "../../controller/logVideos-controller.js";

const userRouter = new express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

userRouter.use(authMiddleware);

// User API
userRouter.get('/api/users/current', userController.getCurrent);
userRouter.patch('/api/users/current',upload.single('profile_picture'), userController.update);
userRouter.delete('/api/users/logout', userController.logout);

userRouter.get('/api/uom/get-one/:id', uomController.getOneUOM);
userRouter.get('/api/uom/get', uomController.getUOM);

userRouter.get('/api/waste-category/get-one/:id', wasteCategoryController.getOneWasteCategory);
userRouter.get('/api/waste-category/get', wasteCategoryController.getWasteCategory);

userRouter.get('/api/pricelist/get', pricelistController.getPricelist);
userRouter.get('/api/pricelist/get-one/:wasteTypeId/:uomId', pricelistController.getOne);

userRouter.get('/api/transaction/list', transactionController.listAllTransactions);
userRouter.get('/api/transaction/getOne/:id', transactionController.getTransactionById);

userRouter.get('/api/transactionData/list', transactionDataController.listAllTransactionData);
userRouter.get('/api/transactionData/getOne/:Id', transactionDataController.getTransactionDataById);

userRouter.get('/api/waste-type/get-one/:id', wasteTypeController.getOneWasteType);
userRouter.get('/api/waste-type/get', wasteTypeController.getWasteType);

userRouter.get('/api/log-article/list', logArticleController.getLogArticles);
userRouter.get('/api/log-article/getOne/:id', logArticleController.getOneLogArticles);

userRouter.get('/api/article/list', articleController.getArticles);
userRouter.get('/api/log-article/getOne/:article_id/:accessed_by', logArticleController.getOneLogArticles);

userRouter.get('/api/videos/list', videosController.getVideos);
userRouter.get('/api/videos/getOne/:id', videosController.getOneVideos);

userRouter.get('/api/log-videos/list', logVideosController.getLogVideos);
userRouter.get('/api/log-videos/getOne/:video_id/:accessed_by', logVideosController.getOneLogVideos);

userRouter.get('/api/count/articles/:articleId/:option', logArticleController.countArticles);
userRouter.get('/api/count/videos/:videosId/:option', logVideosController.countVideos);

export {
    userRouter
}
