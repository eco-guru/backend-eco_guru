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
    const transactions = await prismaClient.transactions.findMany({
        select: {
            id: true,
            transaction_date: true,
            total: true,
            TransactionData: {
                select: {
                    price: true,
                    quantity: true,
                }
            }
        },
    });
    return transactions;
};
  
const getTransactionById = async (id) => {
    id = validate(ListAndDeleteSchema, id);
    const transaction = await prismaClient.transactions.findUnique({
        where: {
            id,
        },
        select: {
            Users: {
                select: {
                    username: true
                }
            },
            TransactionData: {
                select: {
                    quantity: true,
                    price: true,
                    WasteType: {
                        select: {
                            type: true
                        }
                    }
                }
            }
        }
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

const getTransactionDataReport = async (userTransactions) => {
    const transaction = await Promise.all(userTransactions.map(async (value) => {
        const transactionData = await prismaClient.transactionData.findMany({
            where: { transaction_id: value.id },
            select: {
                quantity: true,
                UOM: {
                    select: {
                        unit: true
                    }
                },
                WasteType: {
                    select : {
                        WasteCategory: {
                            select: {
                                category: true
                            }
                        }
                    }
                }
            }
        });
        const transactionResultData = transactionData.map(value => {
            return {
                waste_category: value.WasteType.WasteCategory.category,
                unit_name: value.UOM.unit,
                quantity: value.quantity
            }
        })
        return transactionResultData;
    }))

    const transactionsData = transaction.flat().reduce((acc, item) => {
        const { waste_category, unit_name, quantity } = item;
        if(!acc[waste_category]) acc[waste_category] = { unit_name, quantity: 0 };
        acc[waste_category].quantity += quantity
        return acc;
    }, {});
    
    const transactions = Object.entries(transactionsData).map(([key, value]) => {
        return {
            waste_category: key,
            quantity: value.quantity,
            unit_name: value.unit_name
        };
    });

    return transactions;
}

const getTransactionReport = async (where) => {
    const userTransactions = await prismaClient.transactions.findMany({
        where: where,
        select: { 
            id: true, 
            transaction_date: true 
        }
    });
    return userTransactions;
}

const getReportData = async (userTransactions) => {
    const reportData = await Promise.all(userTransactions.map(async value => {
        const transactionData = await prismaClient.transactionData.findMany({
            where: { 
                transaction_id: value.id,
                OR: [
                    { UOM: { unit: "Kilogram" } },
                    { UOM: { unit: "Kg" } }
                ]
            },
            select: {
                quantity: true,
                UOM: {
                    select: {
                        unit: true
                    }
                },
                WasteType: {
                    select: {
                        WasteCategory: {
                            select: {
                                category: true
                            }
                        }
                    }
                }
            }
        });
        const transactionResultData = transactionData.map(val => {
            return {
                unit_name: val.UOM.unit,
                quantity: val.quantity,
                transaction_month: value.transaction_date,
                category: val.WasteType.WasteCategory.category
            }
        })
        return transactionResultData;
    }));
    return reportData;
}

const getUserReportSpecifyData = async (request) => {
    const data = jwt.verify(request.token, process.env.SECRET_KEY);

    const userTransactions = await getTransactionReport({ 
        user_id: data.id,
    });

    const reportData = await getReportData(userTransactions);
    const reportFlatData = reportData.flat().reduce((acc, curr) => {
        const category = curr.category;
        const monthKey = curr.transaction_month.toISOString().slice(0, 7);
      
        if (!acc[category]) {
          acc[category] = {};
        }
      
        if (!acc[category][monthKey]) {
          acc[category][monthKey] = {
            total_quantity: 0,
          };
        }
      
        acc[category][monthKey].total_quantity += curr.quantity;
      
        return acc;
    }, {});
    const report = Object.entries(reportFlatData).flatMap(([category, months]) =>
        Object.entries(months).map(([transaction_month, { total_quantity }]) => ({
          waste_category: category,
          transaction_month,
          total_quantity,
        }))
    );
    return {
        report: report
    };
}

const getUserTransactionReport = async (request) => {
    const data = jwt.verify(request.token, process.env.SECRET_KEY);

    const userTransactions = await getTransactionReport({ 
        user_id: data.id,
    });

    const reportData = await getReportData(userTransactions);

    const reportFlatData = reportData.flat().reduce((acc, curr) => {
        const monthKey = curr.transaction_month.toISOString().slice(0, 7);
        if (!acc[monthKey]) {
          acc[monthKey] = {
            total_quantity: 0,
            transaction_month: curr.transaction_month,
          };
        }
        acc[monthKey].total_quantity += curr.quantity;
      
        return acc;
      }, {});
    
    const report = Object.entries(reportFlatData).map(([key, value]) => {
        return {
            transaction_month: value.transaction_month,
            total_quantity: value.total_quantity,
        };
    });

    const userTransactionsData = await getTransactionReport({ 
        user_id: data.id,
        transaction_date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        }
    });
    const transactions = await getTransactionDataReport(userTransactionsData);

    return {
        report: report,
        transactions: transactions
    }
}

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
    deleteTransaction,
    getUserTransactionReport,
    getTransactionDataReport,
    getUserReportSpecifyData
};