import wastePickupService from "../services/waste-pickup-service.js";

const getAllWastePickups = async (req, res, next) => {
  try {
    const result = await wastePickupService.getAllWastePickups();
    res.status(200).json({
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getOneWastePickup = async (req, res, next) => {
  try {
    const wastePickupId = parseInt(req.params.id);
    const result = await wastePickupService.getOneWastePickup(wastePickupId);
    res.status(200).json({
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const createWastePickup = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await wastePickupService.createWastePickup(request);
    res.status(201).json({
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const updateWastePickup = async (req, res, next) => {
  try {
    const wastePickupId = parseInt(req.params.id);
    const request = {
      id: wastePickupId,
      ...req.body
    };
    const result = await wastePickupService.updateWastePickup(request);
    res.status(200).json({
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const deleteWastePickup = async (req, res, next) => {
  try {
    const wastePickupId = parseInt(req.params.id);
    const result = await wastePickupService.deleteWastePickup(wastePickupId);
    res.status(200).json({
      message: "Waste pickup deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllWastePickups,
  getOneWastePickup,
  createWastePickup,
  updateWastePickup,
  deleteWastePickup
};