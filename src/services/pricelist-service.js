import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import {getAndDeletePricelistValidation, postAndUpdatePricelistValidation} from "../validation/pricelist-validation.js";

const getPricelist = async () => {
    const pricelist = await prismaClient.pricelist.findMany({
        select:{
            waste_type_id: true,
            uom_id: true,
            price: true,
            start_date: true,
            end_date: true
        }
    });

    if(!pricelist) {
        throw new ResponseError(404, "Pricelist not found");
    }

    return pricelist;
}

const postPricelist = async (request) => {
    request = validate(postAndUpdatePricelistValidation,request);

    if(request.end_date < request.start_date) {
        throw new ResponseError(400, "End date must be greater than start date");
    }

    const data = await prismaClient.pricelist.findFirst({
        where:{
            waste_type_id: request.waste_type_id,
            uom_id: request.uom_id
        }
    })

    if(data) {
        throw new ResponseError(400, "PriceList already exists");
    }

    const wasteCategories = await prismaClient.wasteCategory.findFirst({
        where:{
            id: request.waste_type_id
        }
    })

    if(!wasteCategories) {
        throw new ResponseError(404, "Waste Category not found");
    }

    const uom = await prismaClient.uOM.findFirst({
        where:{
            id: request.uom_id
        }
    })

    if(!uom) {
        throw new ResponseError(404, "UOM not found");
    }

    const pricelist = await prismaClient.pricelist.create({
        data: request
    });

    return pricelist;
}

const updatePricelist = async (request) => {
    request = validate(postAndUpdatePricelistValidation,request);
    const data = await prismaClient.pricelist.findFirst({
        where:{
            waste_type_id: request.waste_type_id,
            uom_id: request.uom_id
        }
    })

    if(!data) {
        throw new ResponseError(404, "Pricelist not found");
    }

    if(request.end_date < request.start_date) {
        throw new ResponseError(400, "End date must be greater than start date");
    }

    const wasteCategories = await prismaClient.wasteCategory.findFirst({
        where:{
            id: request.waste_type_id
        }
    })

    if(!wasteCategories) {
        throw new ResponseError(404, "Waste Category not found");
    }

    const uom = await prismaClient.uOM.findFirst({
        where:{
            id: request.uom_id
        }
    })

    if(!uom) {
        throw new ResponseError(404, "UOM not found");
    }

    const pricelist = await prismaClient.pricelist.update({
        where: {
            waste_type_id_uom_id: {
                waste_type_id: request.waste_type_id,
                uom_id: request.uom_id
            }
        },
        data: request
    });
    return pricelist;
}

const deletePricelist = async (request) => {
    request = validate(getAndDeletePricelistValidation, request);

    const data = await prismaClient.pricelist.findFirst({
        where:{
            waste_type_id: request.waste_type_id,
            uom_id: request.uomId
        }
    });

    if(!data) {
        throw new ResponseError(404, "Pricelist not found");
    }
    
    const pricelist = await prismaClient.pricelist.update({
        where: {
            waste_type_id_uom_id: {
                waste_type_id: request.waste_type_id,
                uom_id: request.uomId
            }, 
        },
        data:{
            isActive: false
        }
    });
    
    if(!pricelist) {
        throw new ResponseError(404, "Pricelist not found");
    }
    return {
        message: "Pricelist deleted successfully"
    };
}

const getOne = async (request) => {
    request = validate(getAndDeletePricelistValidation, request);
    const data = await prismaClient.pricelist.findFirst({
        where:{
            waste_type_id: request.wasteId,
            uom_id: request.uomId
        }
    });
    if(!data) {
        throw new ResponseError(404, "Pricelist not found");
    }

    return data;
}

export default {
    getPricelist,
    postPricelist,
    updatePricelist,
    deletePricelist,
    getOne
}