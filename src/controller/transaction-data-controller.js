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
      const query = req.query.transaction_id;
      const transactions = await transactionDataService.listAllTransactionData(query);
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
      const { Id } = req.params;
      const transaction = await transactionDataService.getTransactionDataById(Number(Id));
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
      request.id = Number(req.params.Id);
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

  const deleteTransactionData = async (req, res, next) => {
    try {
      const { Id } = req.params;
      const deletedTransaction = await transactionDataService.deleteTransactionData(Number(Id));
      res.status(200).json({
        message: 'Transaction Successfully Deleted',
        data: deletedTransaction
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
    deleteTransactionData
  };