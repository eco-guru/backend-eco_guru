import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import {getAndDeletePricelistValidation, postPricelistValidation, updatePricelistValidation} from "../validation/pricelist-validation.js";

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
    request = validate(postPricelistValidation,request);

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

    const wasteType = await prismaClient.wasteType.findFirst({
        where:{
            id: request.waste_type_id
        }
    })

    if(!wasteType) {
        throw new ResponseError(404, "Waste Type not found");
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
    request = validate(updatePricelistValidation,request);
    const data = await prismaClient.pricelist.findFirst({
        where:{
            waste_type_id: request.params_waste_type_id,
            uom_id: request.params_uom_id
        }
    })

    if(!data) {
        throw new ResponseError(404, "Pricelist not found");
    }

    if(request.end_date < request.start_date) {
        throw new ResponseError(400, "End date must be greater than start date");
    }

    const wasteType = await prismaClient.wasteType.findFirst({
        where:{
            id: request.params_waste_type_id
        }
    })

    if(!wasteType) {
        throw new ResponseError(404, "Waste Type not found");
    }

    const existWasteType = await prismaClient.wasteType.findFirst({
        where:{
            id: request.params_waste_type_id
        }
    })

    if(!existWasteType) {
        throw new ResponseError(404, "Waste Type not found");
    }

    const uom = await prismaClient.uOM.findFirst({
        where:{
            id: request.params_uom_id
        }
    })

    if(!uom) {
        throw new ResponseError(404, "UOM not found");
    }

    const existsUom = await prismaClient.uOM.findFirst({
        where:{
            id: request.uom_id
        }
    })

    if(!existsUom) {
        throw new ResponseError(404, "UOM not found");
    }

    const pricelist = await prismaClient.pricelist.update({
        where: {
            waste_type_id_uom_id: {
                waste_type_id: request.params_waste_type_id,
                uom_id: request.params_uom_id
            }
        },
        data: {
            uom_id: request.uom_id,
            waste_type_id: request.waste_type_id,
            price: request.price,
            isActive: request.isActive,
            start_date: request.start_date,
            end_date: request.end_date
        }
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