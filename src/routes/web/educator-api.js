import express from "express";
import {educatorMiddleware} from "../../middleware/educator-middleware.js";
import articleController from "../../controller/article-controller.js";
import logArticleController from "../../controller/logArticle-controller.js";
import videosController from "../../controller/videos-controller.js";
import logVideosController from "../../controller/logVideos-controller.js";

const educatorRouter = new express.Router();
educatorRouter.use(educatorMiddleware);

educatorRouter.post('/api/article/create', articleController.createArticles);
educatorRouter.put('/api/article/update/:id', articleController.updateArticles);
educatorRouter.get('/api/article/list', articleController.getArticles);
educatorRouter.get('/api/article/getOne/:id', articleController.getOneArticles);
educatorRouter.delete('/api/article/delete/:id', articleController.deleteArticles);

educatorRouter.post('/api/log-article/create', logArticleController.createLogArticles);
educatorRouter.put('/api/log-article/update/:article_id/:accessed_by', logArticleController.updateLogArticles);
educatorRouter.get('/api/log-article/list', logArticleController.getLogArticles);
educatorRouter.get('/api/log-article/getOne/:article_id/:accessed_by', logArticleController.getOneLogArticles);
educatorRouter.delete('/api/log-article/delete/:article_id/:accessed_by', logArticleController.deleteLogArticles);

educatorRouter.post('/api/videos/create', videosController.createVideos);
educatorRouter.put('/api/videos/update/:id', videosController.updateVideos);
educatorRouter.get('/api/videos/list', videosController.getVideos);
educatorRouter.get('/api/videos/getOne/:id', videosController.getOneVideos);
educatorRouter.delete('/api/videos/delete/:id', videosController.deleteVideos);

educatorRouter.post('/api/log-videos/create', logVideosController.createLogVideos);
educatorRouter.put('/api/log-videos/update/:video_id/:accessed_by', logVideosController.updateLogVideos);
educatorRouter.get('/api/log-videos/list', logVideosController.getLogVideos);
educatorRouter.get('/api/log-videos/getOne/:video_id/:accessed_by', logVideosController.getOneLogVideos);
educatorRouter.delete('/api/log-videos/delete/:video_id/:accessed_by', logVideosController.deleteLogVideos);

export{
    educatorRouter
}