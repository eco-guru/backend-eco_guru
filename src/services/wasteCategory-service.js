import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import { createAndUpdateWasteCategoryValidation, getAndDeleteWasteCategoryValidation } from "../validation/wasteCategory-validation.js";


const createWasteCategory = async (request) => {
    request = validate(createAndUpdateWasteCategoryValidation, request);

    const data = await prismaClient.wasteCategory.findFirst({
      where: {
        category: request.category
      }
    });

    if (data) {
      throw new ResponseError(400, 'Waste Category already exists');
    }
  
    const newWasteCategory = await prismaClient.wasteCategory.create({
      data: request
    });
  
    return newWasteCategory;
};

const updateWasteCategory = async (request) => {
    request = validate(createAndUpdateWasteCategoryValidation, request);
  
    const existingWasteCategory = await prismaClient.wasteCategory.findUnique({
      where: { id: request.id }
    });
  
    if (!existingWasteCategory) {
      throw new ResponseError(404, 'Waste Category not found');
    }
  
    const updatedWasteCategory = await prismaClient.wasteCategory.update({
      where: { id: request.id },
      data: request
    });
  
    return updatedWasteCategory;
};

const deleteWasteCategory = async (id) => {
    id = validate(getAndDeleteWasteCategoryValidation, id);
  
    const existingWasteCategory = await prismaClient.wasteCategory.findUnique({
      where: { id: id }
    });
  
    if (!existingWasteCategory) {
      throw new ResponseError(404, 'Waste Category not found');
    }
  
    await prismaClient.wasteCategory.update({
      where: { id: id },
      data: { isDeleted: true }
    });
};

const getOneWasteCategory = async (id) => {
    id = validate(getAndDeleteWasteCategoryValidation, id);
  
    const existingWasteCategory = await prismaClient.wasteCategory.findUnique({
      where: { id: id }
    });
  
    if (!existingWasteCategory) {
      throw new ResponseError(404, 'Waste Category not found');
    }
  
    return existingWasteCategory;
};

const getWasteCategory = async () => { 
    const result = await prismaClient.wasteCategory.findMany();
    return result;
};


export default{
    createWasteCategory,
    updateWasteCategory,
    deleteWasteCategory,
    getWasteCategory,
    getOneWasteCategory
}