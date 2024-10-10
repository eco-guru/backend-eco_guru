import uomService from '../services/uom-service.js';

const createUOM = async (req, res) => {
  try {
    const request = req.body;
    const result = await uomService.createUOM(request);
    return res.status(201).json({
      message: 'UOM created successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const updateUOM = async (req, res) => {
    try {
        const request = req.body;
        request.id = req.params.id;
        const result = await uomService.updateUOM(request);
        return res.status(200).json({
        message: 'UOM updated successfully',
        data: result
        });
    } catch (error) {
        return res.status(400).json({
        message: error.message
        });
    }
};
  
const deleteUOM = async (req, res) => {
    try {
        const request = req.params.id;
        await uomService.deleteUOM(request);
        return res.status(200).json({
        message: 'UOM deleted successfully'
        });
    } catch (error) {
        return res.status(400).json({
        message: error.message
        });
    }
};

const getOneUOM = async (req, res) => {
    try {
        const request = req.params.id;
        const result = await uomService.getOneUOM(request);
        return res.status(200).json({
        message: 'UOM retrieved successfully',
        data: result
        });
    } catch (error) {
        return res.status(400).json({
        message: error.message
        });
    }
};

const getUOM = async (req, res) => {
    try {
        const result = await uomService.getUOM();
        return res.status(200).json({
        message: 'UOM retrieved successfully',
        data: result
        });
    } catch (error) {
        return res.status(400).json({
        message: error.message
        });
    }
};

export default {
  createUOM,
  updateUOM,
  deleteUOM,
  getOneUOM,
  getUOM
}