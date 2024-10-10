import wasteCategoryService from '../services/wasteCategory-service.js';

const createWasteCategory = async (req, res) => {
  try {
    const request = req.body;
    const result = await wasteCategoryService.createWasteCategory(request);
    return res.status(201).json({
      message: 'Waste Category created successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const updateWasteCategory = async (req, res) => {
  try {
        const request = req.body;
        request.id = req.params.id;
        const result = await wasteCategoryService.updateWasteCategory(request);
        return res.status(200).json({
        message: 'Waste Category updated successfully',
        data: result
        });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const deleteWasteCategory = async (req, res) => {
  try {
    const request = req.params.id;
    const result = await wasteCategoryService.deleteWasteCategory(request);
    return res.status(200).json({
      message: 'Waste Category deleted successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const getWasteCategory = async (req, res) => {
  try {
    const result = await wasteCategoryService.getWasteCategory();
    return res.status(200).json({
      message: 'Waste Category retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const getOneWasteCategory = async (req, res) => {
  try {
    const request = req.params.id;
    const result = await wasteCategoryService.getOneWasteCategory(request);
    return res.status(200).json({
      message: 'Waste Category retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};


export default {
    createWasteCategory,
    updateWasteCategory,
    deleteWasteCategory,
    getWasteCategory,
    getOneWasteCategory
}