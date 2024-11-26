import transactionService from '../services/transaction-service.js';
import transactionDataService from '../services/transaction-data-service.js';
import wasteCategoryService from '../services/wasteCategory-service.js';
import userService from '../services/user-service.js';

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

const createTransactionMobile = async (req, res) => {
  try {
    const user = await userService.getUserByUsername(req.body.username);
    const updateBalance = user.balance + req.body.totalAmount;
    const approved = await userService.getUserByUsername(req.body.approvedByUsername);
    await userService.updateBalance({ user_id: user.id, total: updateBalance });
    const request = {
      user_id: user.id,
      transaction_date: new Date(),
      total: req.body.totalAmount,
      approved_by: approved.id
    }

    const data = await transactionService.createTransaction(request);
    const transactionData = req.body.transactionData;
    transactionData.map(async (value) => {
      const requestData = {
        transaction_id: data.id,
        quantity: value.amount,
        price: value.price,
        uom_id: value.uom_id,
        waste_type_id: value.waste_type_id,
      };
      return await transactionDataService.createTransactionData(requestData);
    });
    return res.status(200).json({ message: "Transaksi berhasil" });
  } catch (e) {
    return res.status(500).json({ message: "Terjadi kesalahan saat menyimpan transaksi" });
  }
}

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
    createTransactionMobile,
    listAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
  };