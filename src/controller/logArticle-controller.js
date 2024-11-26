import articlesService from '../services/articles-service.js';
import logArticleService from '../services/log-article-service.js';
import userService from '../services/user-service.js';

const createLogArticles = async (req, res) => {
  try {
    const request = req.body;
    const result = await logArticleService.createArticle(request);
    return res.status(201).json({
      message: 'Log Articles created successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const createLogMobileArticles = async (req, res) => {
  try {
    if(req.body.token !== "VISITOR") {
      const users = await userService.getUserByToken(req.body.token);
  
      const articles = await articlesService.getArticles();
      const article_id = articles.find(article => article.title === req.body.title);
  
      const request = {article_id: article_id.id, accessed_by: users.username};
      await logArticleService.createArticle(request);
    }
    return res.status(201).json({
      message: 'Silahkan membaca artikel'
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const updateLogArticles = async (req, res) => {
  try {
        const request = req.body;
        request.article_id = req.params.article_id;
        request.accessed_by = req.params.accessed_by;
        const result = await logArticleService.updateLogArticle(request);
        return res.status(200).json({
        message: 'Log Articles updated successfully',
        data: result
        });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const deleteLogArticles = async (req, res) => {
  try {
    const request = {};
    request.article_id = req.params.article_id;
    request.accessed_by = req.params.accessed_by;
    const result = await logArticleService.deleteLogArticle(request);
    return res.status(200).json({
      message: 'Log Articles deleted successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const getLogArticles = async (req, res) => {
  try {
    const result = await logArticleService.getLogArticles();
    return res.status(200).json({
      message: 'Log Articles retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const getOneLogArticles = async (req, res) => {
  try {
    const request = {};
    request.article_id = req.params.article_id;
    request.accessed_by = req.params.accessed_by;
    const result = await logArticleService.getOneLogArticle(request);
    return res.status(200).json({
      message: 'Log Articles retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

async function countArticles(req, res) {
  try {
      const { articleId, option } = req.params;

      const count = await logArticleService.countArticleAccessByOptionAndArticleId(Number(articleId), option);

      res.status(200).json({
          message: 'Count retrieved successfully',
          success: true,
          data: count,
      });
  } catch (error) {
      res.status(500).json({
          message: 'Internal server error',
          success: false,
          message: error.message,
      });
  }
}


export default {
    createLogArticles,
    createLogMobileArticles,
    updateLogArticles,
    deleteLogArticles,
    getLogArticles,
    getOneLogArticles,
    countArticles
}