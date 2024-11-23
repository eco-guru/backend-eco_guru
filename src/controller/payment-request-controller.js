import paymentRequestService from "../services/payment-request-service.js";

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

export default {
  get,
  getById,
  create,
  update,
  remove,
};