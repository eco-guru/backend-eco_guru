import paymentRequestService from "../services/payment-request-service.js";
import jwt from 'jsonwebtoken';

const get = async (req, res, next) => {
  try {
    const result = await paymentRequestService.getPaymentRequests();
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMobilePayerById = async (req, res, next) => {
  try {
    const data = jwt.verify(req.params.token, process.env.SECRET_KEY);
    const result = await paymentRequestService.getOnePaymentRequestByUser(parseInt(data.id));
    res.status(200).json({
      disbursement: result,
    });
  } catch (error) {
    next(error);
  }
}

const giveConfirmation = async (req, res) => {
  try {
    const data = jwt.verify(req.params.token, process.env.SECRET_KEY);
    const response = await paymentRequestService.giveConfirmationService(req.body, data.id, res);
    return response;
  } catch (error) {
    return res.status(500).json({ message: "Pencarian gagal! Pastikan Anda tidak melebihi batas saldo yang anda miliki" });
  }
}

const accept = async (req, res) => {
  try {
    const response = await paymentRequestService.acceptPayment(req.body, res);
    return response;
  } catch (e) {
    return res.status(500).json({ message: "Pencarian gagal! Pastikan Anda tidak melebihi batas saldo yang anda miliki" });
  }
}

const decline = async (req, res) => {
  try {
    const response = await paymentRequestService.declinePayment(req.body, res);
    return response;
  } catch (error) {
    return res.status(500).json({ message: "Pencarian gagal dibatalkan dikarenakan kesalahan server. Silahkan dicoba lagi" });
  }
}

const getById = async (req, res, next) => {
  try {
    const paymentRequestId = parseInt(req.params.paymentRequestId);
    const result = await paymentRequestService.getOnePaymentRequest(paymentRequestId);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const result = await paymentRequestService.createNewPaymentRequest(req.body);
    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const params = req.params.paymentRequestId;
    const request = { ...req.body, payment_request_id: params };
    const result = await paymentRequestService.updatePaymentRequestById(request);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const paymentRequestId = parseInt(req.params.paymentRequestId);
    await paymentRequestService.deletePaymentRequest(paymentRequestId);
    res.status(200).json({
      message: "Payment request deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const createMobilePaymentRequest = async (req, res) => {
  try {
    const request = {
      token: req.params.token,
      amount: req.body.amount
    };
    const result = await paymentRequestService.createNewMobilePaymentRequest(request, res);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export default {
  get,
  getMobilePayerById,
  getById,
  create,
  update,
  remove,
  createMobilePaymentRequest,
  giveConfirmation,
  accept,
  decline
};