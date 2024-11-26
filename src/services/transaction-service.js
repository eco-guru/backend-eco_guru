import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import {createSchema, ListAndDeleteSchema, updateSchema, tokenValidation} from "../validation/transaction-validation.js"
import jwt from 'jsonwebtoken';

const createTransaction = async (data) => {
    data = validate(createSchema, data);
    const user = await prismaClient.users.findUnique({
        where: {
          id: data.user_id,
        },
    });
    if (!user) {
        throw new ResponseError(404, 'User not found');
    }
    
    const wasteCategory = await prismaClient.users.findUnique({
        where: {
          id: data.approved_by,
        },
    });
    if (!wasteCategory) {
        throw new ResponseError(404, 'Approved by not found in Users');
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
        throw new ResponseError(404, 'Transaction not found');
    }

    return transaction;
};

const getTransactionByUser = async (token) => {
    token = validate(tokenValidation, token);
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const transaction = await prismaClient.transactions.findMany({
        where: {
            user_id: data.id,
        },
    });

    if (!transaction) {
        throw new ResponseError(404, 'Transaction not found');
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
        throw new ResponseError(404, 'Transaction not found');
    }

    const user = await prismaClient.users.findUnique({
        where: {
        id: request.user_id,
        },
    });
    if (!user) {
        throw new ResponseError(404, 'User not found');
    }

    const wasteCategory = await prismaClient.wasteCategory.findUnique({
        where: {
        id: request.approved_by,
        },
    });
    if (!wasteCategory) {
        throw new ResponseError(404, 'Approved by not found in Waste Category');
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

const deleteTransaction = async (request) => {
    request = validate(ListAndDeleteSchema, request);

    const transaction = await prismaClient.transactions.findUnique({
        where: { id: request }
    });

    if (!transaction) {
        throw new ResponseError(404, 'Transaction not found');
    }

    const transactionData = await prismaClient.transactionData.findMany({
        where: { transaction_id: request }
    });

    if (transactionData.length > 0) {
        throw new ResponseError(409, 'Cannot delete transaction with associated transaction data');
    }

    const deletedTransaction = await prismaClient.transactions.delete({
        where: { id: request }
    });

    return deletedTransaction;
};


export default {
    createTransaction,
    listAllTransactions,
    getTransactionById,
    getTransactionByUser,
    updateTransaction,
    deleteTransaction
};