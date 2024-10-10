import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import { createAndUpdateUOMValidation, getAndDeleteUomValidation } from "../validation/uom-validation.js";

const createUOM = async (request) => {
    request = validate(createAndUpdateUOMValidation, request);

    const data = await prismaClient.uOM.findFirst({
        where: {
            unit: request.unit
        }
    });

    if (data) {
        throw new ResponseError(400, 'UOM already exists');
    }

    const newUOM = await prismaClient.uOM.create({
      data: request
    });

    return newUOM;
};

const updateUOM = async (request) => {
    request = validate(createAndUpdateUOMValidation, request);

    const existingUOM = await prismaClient.uOM.findUnique({
      where: { id: request.id }
    });
  
    if (!existingUOM) {
      throw new ResponseError(404,'UOM not found');
    }
  
    const updatedUOM = await prismaClient.uOM.update({
      where: { id: request.id},
      data: request
    });
  
    return updatedUOM;
};
  

const deleteUOM = async (id) => {
    id = validate(getAndDeleteUomValidation, id);
    const existingUOM = await prismaClient.uOM.findUnique({
        where: { id: id }
    });

    if (!existingUOM) {
        throw new ResponseError(404,'UOM not found');
    }

    await prismaClient.uOM.delete({
        where: { id: id }
    });
};

const getOneUOM = async (id) => {
    id = validate(getAndDeleteUomValidation, id);
    const existingUOM = await prismaClient.uOM.findUnique({
        where: { id: id }
    });

    if (!existingUOM) {
        throw new ResponseError(404,'UOM not found');
    }

    return existingUOM;
};

const getUOM = async () => {
    return await prismaClient.uOM.findMany();
}

export default {
    createUOM,
    updateUOM,
    deleteUOM,
    getOneUOM,
    getUOM
}