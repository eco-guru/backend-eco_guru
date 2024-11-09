import articleService from '../services/articles-service.js';

const createArticles = async (req, res) => {
  try {
    const request = req.body;
    const result = await articleService.postArticle(request);
    return res.status(201).json({
      message: 'Articles created successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const updateArticles = async (req, res) => {
  try {
        const request = req.body;
        request.id = req.params.id;
        const result = await articleService.updateArticle(request);
        return res.status(200).json({
        message: 'Articles updated successfully',
        data: result
        });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const deleteArticles = async (req, res) => {
  try {
    const request = req.params.id;
    const result = await articleService.deleteArticle(request);
    return res.status(200).json({
      message: 'Articles deleted successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const getArticles = async (req, res) => {
  try {
    const result = await articleService.getArticles();
    return res.status(200).json({
      message: 'Articles retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const getOneArticles = async (req, res) => {
  try {
    const request = req.params.id;
    const result = await articleService.getOneArticle(request);
    return res.status(200).json({
      message: 'Articles retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};


export default {
    createArticles,
    updateArticles,
    deleteArticles,
    getArticles,
    getOneArticles
}