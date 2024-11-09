import wasteTypeService from '../services/wasteType-service.js';

const createWasteType = async (req, res) => {
  try {
    const request = req.body;
    const result = await wasteTypeService.createWasteType(request);
    return res.status(201).json({
      message: 'Waste Type created successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const updateWasteType = async (req, res) => {
  try {
        const request = req.body;
        request.id = req.params.id;
        const result = await wasteTypeService.updateWasteType(request);
        return res.status(200).json({
        message: 'Waste Type updated successfully',
        data: result
        });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const deleteWasteType = async (req, res) => {
  try {
    const request = req.params.id;
    const result = await wasteTypeService.deleteWasteType(request);
    return res.status(200).json({
      message: 'Waste Type deleted successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const getWasteType = async (req, res) => {
  try {
    const result = await wasteTypeService.getWasteType();
    return res.status(200).json({
      message: 'Waste Type retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const getOneWasteType = async (req, res) => {
  try {
    const request = req.params.id;
    const result = await wasteTypeService.getOneWasteType(request);
    return res.status(200).json({
      message: 'Waste Type retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};


export default {
    createWasteType,
    updateWasteType,
    deleteWasteType,
    getWasteType,
    getOneWasteType
}