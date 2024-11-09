import transactionService from '../services/transaction-service.js';

const createTransaction = async (req, res, next) => {
  try {
    const request = req.body;
    console.log(request);
    const result = await transactionService.createTransaction(request);
    return res.status(201).json({
        message: 'Transaction created successfully',
        data: result
      });
  } catch (e) {
    next(e);
  }
};

const listAllTransactions = async (req, res, next) => {
    try {
      const transactions = await transactionService.listAllTransactions();
      res.status(200).json({
        message: 'Transaction Successfully Showed',
        data: transactions
      });
    } catch (e) {
      next(e);
    }
  };
  
  const getTransactionById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const transaction = await transactionService.getTransactionById(Number(id));
      res.status(200).json({
        message: 'Transaction Successfully Showed',
        data: transaction
      });
    } catch (e) {
      next(e);
    }
  };
  
  const updateTransaction = async (req, res, next) => {
    try {
      const request = req.body;
      request.id = Number(req.params.id);
      console.log(request);
      const updatedTransaction = await transactionService.updateTransaction(request);
      res.status(200).json({
        message: 'Transaction Successfully Updated',
        data: updatedTransaction
      });
    } catch (e) {
      next(e);
    }
  };

  const deleteTransaction = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedTransaction = await transactionService.deleteTransaction(Number(id));
      res.status(200).json({
        message: 'Transaction Successfully Deleted',
        data: deletedTransaction
      });
    } catch (e) {
      next(e);
    }
  };

  export default {
    createTransaction,
    listAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
  };