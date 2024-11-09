import logArticleService from '../services/log-article-service.js';

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


export default {
    createLogArticles,
    updateLogArticles,
    deleteLogArticles,
    getLogArticles,
    getOneLogArticles
}