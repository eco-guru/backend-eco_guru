import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import {createSchema, ListAndDeleteSchema, updateSchema} from "../validation/transaction-validation.js"

const createTransaction = async (data) => {
    data = validate(createSchema, data);
    const user = await prismaClient.users.findUnique({
        where: {
          id: data.user_id,
        },
    });
    if (!user) {
        throw new ResponseError('User not found');
    }
    
    const wasteCategory = await prismaClient.wasteCategory.findUnique({
        where: {
          id: data.approved_by,
        },
    });
    if (!wasteCategory) {
        throw new ResponseError('Approved by not found in Waste Category');
    }
    
    const transaction = await prismaClient.transactions.create({
        data: {
          user_id: data.user_id,
          transaction_date: data.transaction_date,
          total: data.total,
          approved_by: data.approved_by,
        },
    });
    
    return transaction;
};

const listAllTransactions = async () => {
    const transactions = await prismaClient.transactions.findMany();
    return transactions;
};
  
const getTransactionById = async (id) => {
    id = validate(ListAndDeleteSchema, id);
    const transaction = await prismaClient.transactions.findUnique({
        where: {
            id,
        },
    });

    if (!transaction) {
        throw new Error('Transaction not found');
    }

    return transaction;
};

const updateTransaction = async (request) => {
    request = validate(updateSchema, request);
    const transaction = await prismaClient.transactions.findUnique({
        where: {
            id: request.id,
        },
    });
    if (!transaction) {
        throw new Error('Transaction not found');
    }

    const user = await prismaClient.users.findUnique({
        where: {
        id: request.user_id,
        },
    });
    if (!user) {
        throw new Error('User not found');
    }

    const wasteCategory = await prismaClient.wasteCategory.findUnique({
        where: {
        id: request.approved_by,
        },
    });
    if (!wasteCategory) {
        throw new Error('Approved by not found in Waste Category');
    }

    const updatedTransaction = await prismaClient.transactions.update({
        where: {
        id: request.id,
        },
        data: {
            user_id: request.user_id,
            transaction_date: request.transaction_date,
            total: request.total,
            approved_by: request.approved_by,
        },
    });

    return updatedTransaction;
};

const deleteTransaction = async (id) => {
    id = validate(ListAndDeleteSchema, id);
    const transaction = await prismaClient.transactions.findUnique({
        where: {
        id,
        },
    });
    if (!transaction) {
        throw new Error('Transaction not found');
    }

    await prismaClient.transactions.delete({
        where: {
        id,
        },
    });

    return { message: 'Transaction deleted' };
};

export default {
    createTransaction,
    listAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
};