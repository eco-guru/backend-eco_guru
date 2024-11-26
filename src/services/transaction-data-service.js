import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createAndUpdateSchema, getOneSchema } from "../validation/transaction-data-validation.js";
import {validate} from "../validation/validation.js";

const createTransactionData = async (data) => {
    data = validate(createAndUpdateSchema, data);
    console.log(data);
    const transaction = await prismaClient.transactions.findFirst({
        where: {
          id: data.transaction_id,
        },
    });
    if (!transaction) {
        throw new ResponseError(404, 'Transaction not found');
    }
    
    const wasteType = await prismaClient.wasteType.findUnique({
        where: {
          id: data.waste_type_id,
        },
    });
    if (!wasteType) {
        throw new ResponseError(404, 'Waste Type Not Found');
    }

    const uom = await prismaClient.uOM.findUnique({
        where: {
          id: data.uom_id,
        },
    });
    if (!uom) {
        throw new ResponseError(404, 'Uom Not Found');
    }
    
    const transactionData = await prismaClient.transactionData.create({
        data: {
          transaction_id: data.transaction_id,
          waste_type_id: data.waste_type_id,
          uom_id: data.uom_id,
          quantity: data.quantity,
          price: data.price
        },
    });
    
    return transactionData;
};

const listAllTransactionData = async (query) => {
    query = validate(getOneSchema, query);
    if(query){
        const isEmptyTransactionData = await prismaClient.transactionData.findFirst({
            where: {
                transaction_id: query
            }
        });

        if(!isEmptyTransactionData){
            throw new ResponseError(404, 'Transaction Data Not Found');
        }

        const transactionData = await prismaClient.transactionData.findMany({
            where: {
                transaction_id: query
            },
            select:{
                WasteType:{
                    select:{
                        type: true
                    }
                },
                UOM:{
                    select:{
                        unit: true
                    }
                },
                transaction_id: true,
                quantity: true,
                price: true
            }
        });

        transactionData.forEach(element => {
            element.waste_type = element.WasteType.type;
            element.uom = element.UOM.unit;
            delete element.WasteType;
            delete element.UOM;
        });

        return transactionData;
    }else{
        const transactionData = await prismaClient.transactionData.findMany({
            select:{
                WasteType:{
                    select:{
                        type: true
                    }
                },
                UOM:{
                    select:{
                        unit: true
                    }
                },
                transaction_id: true,
                quantity: true,
                price: true
            }
        });
    
        transactionData.forEach(element => {
            element.waste_type = element.WasteType.type;
            element.uom = element.UOM.unit;
            delete element.WasteType;
            delete element.UOM;
        });
    
        return transactionData; 
    }
};

const getTransactionDataById = async (id) => {
    id = validate(getOneSchema, id);
    const transactionData = await prismaClient.transactionData.findFirst({
        where: {
            id: id,
        },
        select:{
            WasteType:{
                select:{
                    type: true
                }
            },
            UOM:{
                select:{
                    unit: true
                }
            },
            transaction_id: true,
            quantity: true,
            price: true
        }
    });

    if (!transactionData) {
        throw new ResponseError(404, 'Transaction not found');
    }

    transactionData.waste_type = transactionData.WasteType.type;
    transactionData.uom = transactionData.UOM.unit;
    delete transactionData.WasteType;
    delete transactionData.UOM;

    return transactionData;
};

const updateTransactionData = async (request) => {
    request = validate(createAndUpdateSchema, request);

    const transactionData = await prismaClient.transactionData.findFirst({
        where: {
            id: request.id,
        },
    });

    if (!transactionData) {
        throw new ResponseError(404, 'Transaction Data Not Found');
    }

    // Check for required entities
    const transaction = await prismaClient.transactionData.findFirst({
        where: { transaction_id: request.transaction_id },
    });
    if (!transaction) {
        throw new ResponseError(404, 'Transaction Not Found');
    }

    const uom = await prismaClient.uOM.findUnique({
        where: { id: request.uom_id },
    });
    if (!uom) {
        throw new ResponseError(404, 'UOM Not Found');
    }

    const wasteType = await prismaClient.wasteType.findUnique({
        where: { id: request.waste_type_id },
    });

    if (!wasteType) {
        throw new ResponseError(404, 'Waste Type Not Found');
    }

    // Update transaction data using the unique composite key
    const updatedTransaction = await prismaClient.transactionData.update({
        where: {
            id: request.id
        },
        data: {
            transaction_id: request.transaction_id,
            waste_type_id: request.waste_type_id,
            uom_id: request.uom_id,
            quantity: request.quantity,
            price: request.price,
        },
        select:{
            WasteType:{
                select:{
                    type: true
                }
            },
            UOM:{
                select:{
                    unit: true
                }
            },
            transaction_id: true,
            quantity: true,
            price: true
        }
    });

    updatedTransaction.waste_type = updatedTransaction.WasteType.type;
    updatedTransaction.uom = updatedTransaction.UOM.unit;
    delete updatedTransaction.WasteType;
    delete updatedTransaction.UOM;

    return updatedTransaction;
};


const deleteTransactionData = async (request) => {
    request = validate(getOneSchema, request);
    
    const transactionData = await prismaClient.transactionData.findFirst({
        where: {
            id: request
        },
    });

    if (!transactionData) {
        throw new ResponseError(404, 'Transaction Data Not Found');
    }

    const deletedTransaction = await prismaClient.transactionData.delete({
        where: {
            id: request
        },
    });

    return deletedTransaction;
};


export default {
    createTransactionData,
    listAllTransactionData,
    getTransactionDataById,
    updateTransactionData,
    deleteTransactionData
};