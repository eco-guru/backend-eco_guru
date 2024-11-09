import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import { createAndUpdateWasteTypeValidation, getAndDeleteWasteTypeValidation } from "../validation/wasteType-validation.js";


const createWasteType = async (request) => {
    request = validate(createAndUpdateWasteTypeValidation, request);

    const data = await prismaClient.wasteType.findFirst({
      where: {
        type: request.type,
        waste_category_id: request.waste_category_id
      }
    });

    if (data) {
      throw new ResponseError(400, 'Waste Type already exists');
    }
  
    const newWasteType = await prismaClient.wasteType.create({
      data: request
    });
  
    return newWasteType;
};

const updateWasteType = async (request) => {
    request = validate(createAndUpdateWasteTypeValidation, request);
  
    const existingWasteType = await prismaClient.wasteType.findUnique({
      where: { id: request.id }
    });
  
    if (!existingWasteType) {
      throw new ResponseError(404, 'Waste Category not found');
    }
  
    const updatedWasteCategory = await prismaClient.wasteType.update({
      where: { id: request.id },
      data: request
    });
  
    return updatedWasteCategory;
};

const deleteWasteType = async (id) => {
    id = validate(getAndDeleteWasteTypeValidation, id);

    const existingWasteType = await prismaClient.wasteType.findUnique({
        where: { id: id }
      });
    
    if (!existingWasteType) {
    throw new ResponseError(404, 'Waste Type not found');
    }

    const dataPriceList = await prismaClient.pricelist.findFirst({
      where:{
        waste_type_id: id
      },
      select:{
        isActive: true
      }
    });

    if(dataPriceList){
      throw new ResponseError(409, "Data Waste Type Constrains with PriceList");
    }

    const dataTransactionData = await prismaClient.transactionData.findFirst({
      where:{
        waste_type_id: id
      }
    });

    if(dataTransactionData){
      throw new ResponseError(409, "Data Waste Type Constrains with Transactions Data");
    }
  
    await prismaClient.wasteType.update({
      where: { id: id },
      data: { isDeleted: true }
    });
};

const getOneWasteType = async (id) => {
    id = validate(getAndDeleteWasteTypeValidation, id);
  
    const existingWasteType = await prismaClient.wasteType.findUnique({
      where: { id: id }
    });
  
    if (!existingWasteType) {
      throw new ResponseError(404, 'Waste Type not found');
    }
  
    return existingWasteType;
};

const getWasteType = async () => { 
    const result = await prismaClient.wasteType.findMany({
      where:{
        isDeleted: false
      },
      select:{
        id: true,
        type: true,
        WasteCategory:{
            select:{
                category: true
            }
        }
      }
    });

    let category = null;

    result.forEach(element => {
        category = element.WasteCategory.category;
        element.waste_category = category;
        delete element.WasteCategory;
    });

    return result;
};


export default{
    createWasteType,
    updateWasteType,
    deleteWasteType,
    getWasteType,
    getOneWasteType
}