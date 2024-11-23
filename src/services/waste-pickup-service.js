import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createWastePickupValidation,
  updateWastePickupValidation,
  getAndDeleteWastePickupValidation
} from "../validation/waste-pickup-validation.js";

// Get all waste pickups
const getAllWastePickups = async () => {
  const wastePickups = await prismaClient.wastePickUp.findMany({
    select: {
      id: true,
      user_id: true,
      pick_up_date: true,
      location: true,
      status: true,
      created_date: true,
      Users: {
        select: {
          username: true,
          phone: true
        }
      }
    }
  });

  wastePickups.forEach((wastePickup) => {
    wastePickup.user_name = wastePickup.Users.username;
    wastePickup.user_phone = wastePickup.Users.phone;
    delete wastePickup.Users;
  });

  if (!wastePickups) {
    throw new ResponseError(404, "No waste pickups found");
  }

  return wastePickups;
};

// Get one waste pickup
const getOneWastePickup = async (request) => {
  request = validate(getAndDeleteWastePickupValidation, request);

  const wastePickup = await prismaClient.wastePickUp.findUnique({
    where: { id: request },
    include: {
      Users: {
        select: {
          username: true,
          phone: true
        }
      }
    }
  });

  wastePickup.user_name = wastePickup.Users.username;
  wastePickup.user_phone = wastePickup.Users.phone;
  delete wastePickup.Users;

  if (!wastePickup) {
    throw new ResponseError(404, "Waste pickup not found");
  }

  return wastePickup;
};

// Create new waste pickup
const createWastePickup = async (request) => {
  request = validate(createWastePickupValidation, request);

  // Check if user exists
  const user = await prismaClient.users.findUnique({
    where: { id: request.user_id }
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  const wastePickup = await prismaClient.wastePickUp.create({
    data: request,
    include: {
      Users: {
        select: {
          username: true,
          phone: true
        }
      }
    }
  });

  wastePickup.user_name = wastePickup.Users.username;
  wastePickup.user_phone = wastePickup.Users.phone;
  delete wastePickup.Users;

  return wastePickup;
};

// Update waste pickup
const updateWastePickup = async (request) => {
  request = validate(updateWastePickupValidation, request);

  const wastePickup = await prismaClient.wastePickUp.findUnique({
    where: { id: request.id }
  });

  if (!wastePickup) {
    throw new ResponseError(404, "Waste pickup not found");
  }

  const updatedWastePickup = await prismaClient.wastePickUp.update({
    where: { id: request.id },
    data: request,
    include: {
      Users: {
        select: {
          username: true,
          phone: true
        }
      }
    }
  });

  updatedWastePickup.user_name = updatedWastePickup.Users.username;
  updatedWastePickup.user_phone = updatedWastePickup.Users.phone;
  delete updatedWastePickup.Users;

  return updatedWastePickup;
};

// Delete waste pickup
const deleteWastePickup = async (request) => {
  request = validate(getAndDeleteWastePickupValidation, request);

  const wastePickup = await prismaClient.wastePickUp.findUnique({
    where: { id: request }
  });

  if (!wastePickup) {
    throw new ResponseError(404, "Waste pickup not found");
  }

  return prismaClient.wastePickUp.delete({
    where: { id: request }
  });
};

export default {
  getAllWastePickups,
  getOneWastePickup,
  createWastePickup,
  updateWastePickup,
  deleteWastePickup
};