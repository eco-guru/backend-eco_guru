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
        const wasteIid = req.params.wasteIid;
        const result = await pricelistService.deletePricelist(wasteIid);
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
}