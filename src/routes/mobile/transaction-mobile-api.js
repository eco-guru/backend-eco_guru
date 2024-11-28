import express from 'express'
import wasteTypeController from '../../controller/wasteType-controller.js';
import transactionController from '../../controller/transaction-controller.js';
import paymentRequestController from '../../controller/payment-request-controller.js';

export const transactionMobileRouter = express.Router();

transactionMobileRouter.get('/waste-types', wasteTypeController.getWasteTypeMobile);

transactionMobileRouter.post('/transactions', transactionController.createTransactionMobile);
transactionMobileRouter.get('/transaction-history/:token', transactionController.getTransactionByToken);

transactionMobileRouter.post('/disbursement/:token', paymentRequestController.createMobilePaymentRequest);
transactionMobileRouter.put('/give-disbursement-confirmation/:token', paymentRequestController.giveConfirmation);
transactionMobileRouter.get('/get-all-disbursement', paymentRequestController.get);
transactionMobileRouter.get('/history-disbursement/:token', paymentRequestController.getMobilePayerById);
transactionMobileRouter.put('/accept-disbursement/:token', paymentRequestController.accept)
transactionMobileRouter.put('/decline-disbursement', paymentRequestController.decline);

transactionMobileRouter.get('/report/:token', transactionController.getUserTransactionReport);
transactionMobileRouter.get('/report-specify/:token', transactionController.getUserReportSpecify);
  