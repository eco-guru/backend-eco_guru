import pricelistService from '../services/pricelist-service.js';


const getPricelist = async (req, res, next) => {
    try {
        const result = await pricelistService.getPricelist();
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const postPricelist = async (req, res, next) => {
    try {

        const result = await pricelistService.postPricelist(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const updatePricelist = async (req, res, next) => {
    try {
        const result = await pricelistService.updatePricelist(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}


const deletePricelist = async (req, res, next) => {
    try {
        const waste_type_id = req.params.wasteTypeId;
        const uomId = req.params.uomId;
        const request = { waste_type_id, uomId }
        const result = await pricelistService.deletePricelist(request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getOne = async (req, res, next) => {
    try {
        const waste_type_id = req.params.wasteTypeId;
        const uomId = req.params.uomId;
        const request = { waste_type_id, uomId }
        const result = await pricelistService.getOne(request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    getPricelist,
    postPricelist,
    updatePricelist,
    deletePricelist,
    getOne
}