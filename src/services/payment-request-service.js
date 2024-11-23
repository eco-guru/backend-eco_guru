import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createPaymentRequest,
  updatePaymentRequest,
  getAndDeletePaymentRequest,
} from "../validation/payment-request-validation.js";
import { validate } from "../validation/validation.js";

// Get all payment requests
const getPaymentRequests = async () => {
  const paymentRequests = await prismaClient.paymentRequest.findMany({
    select: {
      payment_request_id: true,
      user_id: true,
      request_date: true,
      request_amount: true,
      expected_payment_date: true,
      payment_date: true,
      payment_by: true,
      confirmation_status: true,
      confirmation_date: true,
      user: {
        select: {
          username: true,
        },
      },
      payer: {
        select: {
          username: true,
        },
      },
    },
  });

  paymentRequests.forEach((paymentRequest) => {
    paymentRequest.user_name = paymentRequest.user.username;
    paymentRequest.payer_name = paymentRequest.payer.username;
    delete paymentRequest.user;
    delete paymentRequest.payer;
  });

  if (!paymentRequests) {
    throw new ResponseError(404, "Payment requests not found");
  }

  return paymentRequests;
};

// Get one payment request by ID
const getOnePaymentRequest = async (request) => {
  request = validate(getAndDeletePaymentRequest, request);
  
  const paymentRequest = await prismaClient.paymentRequest.findUnique({
    where: { payment_request_id: request },
    select: {
      payment_request_id: true,
      user_id: true,
      request_date: true,
      request_amount: true,
      expected_payment_date: true,
      payment_date: true,
      payment_by: true,
      confirmation_status: true,
      confirmation_date: true,
      user: {
        select: {
          username: true,
        },
      },
      payer: {
        select: {
          username: true,
        },
      },
    },
  });

  paymentRequest.user_name = paymentRequest.user.username;
  paymentRequest.payer_name = paymentRequest.payer.username;

  delete paymentRequest.user;
  delete paymentRequest.payer;

  if (!paymentRequest) {
    throw new ResponseError(404, "Payment request not found");
  }

  return paymentRequest;
};

// Create new payment request
const createNewPaymentRequest = async (request) => {
  request = validate(createPaymentRequest, request);

  // Check if user exists
  const user = await prismaClient.users.findUnique({
    where: { id: request.user_id },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  // Check if payer exists
  const payer = await prismaClient.users.findUnique({
    where: { id: request.payment_by },
  });

  if (!payer) {
    throw new ResponseError(404, "Payer not found");
  }

  // Check if there's already a payment request between these users
  const existingRequest = await prismaClient.paymentRequest.findFirst({
    where: {
      user_id: request.user_id,
      payment_by: request.payment_by,
    },
  });

  if (existingRequest) {
    throw new ResponseError(400, "Payment request already exists between these users");
  }

  const paymentRequest = await prismaClient.paymentRequest.create({
    data: request,
  });

  return paymentRequest;
};

// Update payment request
const updatePaymentRequestById = async (request) => {
  request = validate(updatePaymentRequest, request);

  const existingRequest = await prismaClient.paymentRequest.findUnique({
    where: { payment_request_id: request.payment_request_id },
  });

  if (!existingRequest) {
    throw new ResponseError(404, "Payment request not found");
  }

  const updatedRequest = await prismaClient.paymentRequest.update({
    where: { payment_request_id: request.payment_request_id },
    data: request,
  });

  return updatedRequest;
};

// Delete payment request
const deletePaymentRequest = async (request) => {
  request = validate(getAndDeletePaymentRequest, request);

  const existingRequest = await prismaClient.paymentRequest.findUnique({
    where: { payment_request_id: request },
  });

  if (!existingRequest) {
    throw new ResponseError(404, "Payment request not found");
  }

  const deletedRequest = await prismaClient.paymentRequest.delete({
    where: { payment_request_id: request },
  });

  return deletedRequest;
};

export default {
  getPaymentRequests,
  getOnePaymentRequest,
  createNewPaymentRequest,
  updatePaymentRequestById,
  deletePaymentRequest,
};