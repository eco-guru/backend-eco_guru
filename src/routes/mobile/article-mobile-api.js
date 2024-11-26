import express from 'express';
import articleController from '../../controller/article-controller.js';
import logArticleController from '../../controller/logArticle-controller.js';

export const articleMobileRouter = express.Router();

articleMobileRouter.get('/articles', articleController.getMobileArticles);
articleMobileRouter.post('/trigger-articles', logArticleController.createLogMobileArticles);
