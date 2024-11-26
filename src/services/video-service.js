import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  UpdateVideos,
  createVideos,
  getAndDeleteVideos,
} from "../validation/videos-validation.js";

// Mendapatkan semua artikel
const getVideos = async () => {
  const videos = await prismaClient.videos.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      format: true,
      thumbnail_url: true,
      url: true,
      upload_date: true,
      uploaded_by: true,
      isActive: true,
      video_order: true,
      categoryId: true
    },
  });

  if (!videos) {
    throw new ResponseError(404, "Videos not found");
  }

  return videos;
};

// Menambahkan artikel baru
const postVideos = async (request) => {
  request = validate(createVideos, request);

  const user = await prismaClient.users.findUnique({
    where: { username: request.uploaded_by },
  });

  if (!user) {
    throw new ResponseError(400, "User not found");
  }

  const videos = await prismaClient.videos.create({
    data: request,
  });

  return videos;
};

// Memperbarui artikel berdasarkan ID
const updateVideos = async (request) => {
  request = validate(UpdateVideos, request);

  const videos = await prismaClient.videos.findUnique({
    where: { id: request.id },
  });

  if (!videos) {
    throw new ResponseError(404, "Videos not found");
  }

  const updatedVideos = await prismaClient.videos.update({
    where: { id: request.id },
    data: request,
  });

  return updatedVideos;
};

// Menghapus artikel berdasarkan ID
const deleteVideos = async (request) => {
  request = validate(getAndDeleteVideos, request);

  const videos = await prismaClient.videos.findUnique({
    where: { id: request },
  });

  if (!videos) {
    throw new ResponseError(404, "Videos not found");
  }

  const dataDelete = await prismaClient.videos.delete({
    where: { id: request },
  });

  return dataDelete;
};

const getOneVideos = async (request) => {
  request = validate(getAndDeleteVideos, request);
  const videos = await prismaClient.videos.findUnique({
    where: { id: request },
  });

  if (!videos) {
    throw new ResponseError(404, "Article not found");
  }

  const data = await prismaClient.videos.findUnique({
    where: { id: request },
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      format: true,
      thumbnail_url: true,
      url: true,
      upload_date: true,
      uploaded_by: true,
      isActive: true,
      video_order: true,
    },
  });

  return data;
};

export default {
  getVideos,
  getOneVideos,
  postVideos,
  updateVideos,
  deleteVideos,
};
