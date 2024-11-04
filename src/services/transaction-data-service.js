import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createAndUpdateSchema, getOneSchema } from "../validation/transaction-data-validation.js";
import {validate} from "../validation/validation.js";

const createTransactionData = async (data) => {
    data = validate(createAndUpdateSchema, data);
    const transaction = await prismaClient.transactions.findFirst({
        where: {
          id: data.transaction_id,
        },
    });
    if (!transaction) {
        throw new ResponseError(404, 'Transaction not found');
    }
    
    const wasteCategory = await prismaClient.wasteCategory.findUnique({
        where: {
          id: data.waste_id,
        },
    });
    if (!wasteCategory) {
        throw new ResponseError(404, 'Waste Category Not Found');
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
          waste_id: data.waste_id,
          uom_id: data.uom_id,
          quantity: data.quantity,
          price: data.price
        },
    });
    
    return transactionData;
};

const listAllTransactionData = async () => {
    const transactionData = await prismaClient.transactionData.findMany();
    return transactionData;
};

const getTransactionDataById = async (id) => {
    id = validate(getOneSchema, id);
    const transactionData = await prismaClient.transactionData.findFirst({
        where: {
            transaction_id: id,
        },
    });

    if (!transactionData) {
        throw new ResponseError(404, 'Transaction not found');
    }

    return transactionData;
};

const updateTransactionData = async (request) => {
    request = validate(createAndUpdateSchema, request);

    const transaction = await prismaClient.transactions.findFirst({
        where: {
            id: request.transaction_id,
        },
    });
    if (!transaction) {
        throw new ResponseError(404, 'Transaction Not Found');
    }

    const uom = await prismaClient.uOM.findUnique({
        where: {
            id: request.uom_id,
        },
    });
    if (!uom) {
        throw new ResponseError(404, 'UOM Not Found');
    }

    const wasteCategory = await prismaClient.wasteCategory.findUnique({
        where: {
            id: request.waste_id,
        },
    });
    if (!wasteCategory) {
        throw new ResponseError(404, 'Waste Category Not Found');
    }

    const transactionData = await prismaClient.transactionData.findFirst({
        where:{
            transaction_id: request.transaction_id,
        },
    });

    if (!transactionData) {
        throw new ResponseError(404, 'Transaction Data Not Found');
    }

    const updatedTransaction = await prismaClient.transactionData.update({
        where: {
            transaction_id_waste_id_uom_id_quantity_price: {
                transaction_id: transactionData.transaction_id,
                waste_id: transactionData.waste_id,
                uom_id: transactionData.uom_id,
                quantity: transactionData.quantity,
                price: transactionData.price,
            },
        },
        data: {
            transaction_id: request.transaction_id,
            waste_id: request.waste_id,
            uom_id: request.uom_id,
            quantity: request.quantity,
            price: request.price,
        },
    });

    return updatedTransaction;
};

export default {
    createTransactionData,
    listAllTransactionData,
    getTransactionDataById,
    updateTransactionData,
};