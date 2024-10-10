import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import {getAndDeletePricelistValidation, postAndUpdatePricelistValidation} from "../validation/pricelist-validation.js";

const getPricelist = async () => {
    const pricelist = await prismaClient.pricelist.findMany({
        select:{
            waste_id: true,
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

    const pricelist = await prismaClient.pricelists.create({
        data: request
    });

    return pricelist;
}

const updatePricelist = async (request) => {
    request = validate(postAndUpdatePricelistValidation,request);
    const data = await prismaClient.pricelist.findFirst({
        where:{
            waste_id: request.waste_id,
            uom_id: request.uom_id,
        }
    })

    if(!data) {
        throw new ResponseError(400, "Pricelist not found");
    }

    const pricelist = await prismaClient.pricelists.update({
        where: {
            id: request.id
        },
        data: request
    });
    return pricelist;
}

const deletePricelist = async (request) => {
    request = validate(getAndDeletePricelistValidation, request);

    const data = await prismaClient.pricelist.findFirst({
        where:{
            waste_id: request.waste_id,
        }
    });

    if(!data) {
        throw new ResponseError(400, "Pricelist not found");
    }
    
    const pricelist = await prismaClient.pricelist.delete({
        where: {
            waste_id: request.waste_id,
        }
    });
    return pricelist;
}

export default {
    getPricelist,
    postPricelist,
    updatePricelist,
    deletePricelist
}