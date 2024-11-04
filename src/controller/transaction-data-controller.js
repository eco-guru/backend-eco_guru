import transactionDataService from "../services/transaction-data-service.js";

const createTransactionData = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await transactionDataService.createTransactionData(request);
    return res.status(201).json({
        message: 'Transaction created successfully',
        data: result
      });
  } catch (e) {
    next(e);
  }
};

const listAllTransactionData = async (req, res, next) => {
    try {
      const transactions = await transactionDataService.listAllTransactionData();
      res.status(200).json({
        message: 'Transaction Successfully Showed',
        data: transactions
      });
    } catch (e) {
      next(e);
    }
  };
  
  const getTransactionDataById = async (req, res, next) => {
    try {
      const { transactionId } = req.params;
      const transaction = await transactionDataService.getTransactionDataById(Number(transactionId));
      res.status(200).json({
        message: 'Transaction Successfully Showed',
        data: transaction
      });
    } catch (e) {
      next(e);
    }
  };
  
  const updateTransactionData = async (req, res, next) => {
    try {
      const request = req.body;
      request.transaction_id = Number(req.params.transactionId);
      console.log(request);
      const updatedTransaction = await transactionDataService.updateTransactionData(request);
      res.status(200).json({
        message: 'Transaction Successfully Updated',
        data: updatedTransaction
      });
    } catch (e) {
      next(e);
    }
  };
  
  export default {
    createTransactionData,
    listAllTransactionData,
    getTransactionDataById,
    updateTransactionData,
  };