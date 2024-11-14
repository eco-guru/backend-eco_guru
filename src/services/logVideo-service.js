import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createLogVideo,
  schemaCountVideos,
  schemaDeleteLogVideo,
  schemaUpdateLogVideo
} from "../validation/logVideos-validation.js";

const getLogVideos = async () => {
  const logVideos = await prismaClient.logVideos.findMany({
    select: {
      video_id: true,
      accessed_by: true,
      accessed_time: true,
    },
  });

  if (!logVideos) {
    throw new ResponseError(404, "Log Videos not found");
  }

  return logVideos;
};

// Mendapatkan satu log artikel berdasarkan artikel_id dan accessed_by
const getOneLogVideos = async (request) => {
  request = validate(schemaDeleteLogVideo, request);
  const logVideos = await prismaClient.logVideos.findMany({
    where: {
      video_id: request.video_id,
      accessed_by: request.accessed_by,
    },
  });

  if (!logVideos) {
    throw new ResponseError(404, "Log Videos not found");
  }

  return logVideos;
};

// Menghapus log artikel berdasarkan artikel_id dan accessed_by
const deleteLogVideos = async (request) => {
  request = validate(schemaDeleteLogVideo, request);

  const logVideos = await prismaClient.logVideos.findMany({
    where: {
      video_id: request.video_id,
      accessed_by: request.accessed_by,
    },
  });

  if (!logVideos) {
    throw new ResponseError(404, "Log videos not found");
  }

  const deleteData = await prismaClient.logVideos.deleteMany({
    where: {
      video_id: request.video_id,
      accessed_by: request.accessed_by,
    },
  });

  return deleteData;
};

// Memperbarui waktu akses pada log artikel
const updateLogVideos = async (request) => {
  request = validate(schemaUpdateLogVideo, request);

  const logVideos = await prismaClient.logVideos.findFirst({
    where: {
      video_id: request.video_id,
      accessed_by: request.accessed_by,
      accessed_time: request.accessed_time_old,
    },
  });

  if (!logVideos) {
    throw new ResponseError(404, "Log Videos not found");
  }

  const updatedLogVideos = await prismaClient.logVideos.update({
    where: {
      video_id_accessed_by_accessed_time: {
        video_id: request.video_id,
        accessed_by: request.accessed_by,
        accessed_time: request.accessed_time_old,
      },
    },
    data: {
      accessed_time: request.accessed_time_new,
    },
  });

  return updatedLogVideos;
};

const createVideos = async (request) => {
  request = validate(createLogVideo, request);

  const videosData = await prismaClient.videos.findFirst({
    where:{
      id: request.video_id
    }
  });

  if(!videosData){
    throw new ResponseError(404, "Videos not found");
  }

  // Jika belum ada, buat log artikel baru
  return await prismaClient.logVideos.create({
    data: {
      video_id: request.video_id,
      accessed_by: request.accessed_by,
      accessed_time: request.accessed_time,
    },
  });
};

const countVideosAccessByOptionAndVideosId = async (videosId, option) => {
  const params = validate(schemaCountVideos, { videosId, option });
  let whereCondition = { video_id: params.videosId };

  if (/^\d{4}-\d{2}-\d{2}$/.test(params.option)) {
      // Daily
      whereCondition.accessed_time = {
          gte: new Date(`${params.option}T00:00:00.000Z`),
          lt: new Date(`${params.option}T23:59:59.999Z`),
      };
  } else if (/^\d{4}-\d{2}$/.test(params.option)) {
      // Monthly
      whereCondition.accessed_time = {
          gte: new Date(`${params.option}-01T00:00:00.000Z`),
          lt: new Date(`${params.option}-31T23:59:59.999Z`),
      };
  } else if (/^\d{4}$/.test(params.option)) {
      // Yearly
      whereCondition.accessed_time = {
          gte: new Date(`${params.option}-01-01T00:00:00.000Z`),
          lt: new Date(`${params.option}-12-31T23:59:59.999Z`),
      };
  } else {
      throw new ResponseError(400,'Invalid option format. Use YYYY-MM-DD, YYYY-MM, or YYYY.');
  }

  // Check if the videos exists
  const videosExists = await prismaClient.videos.findUnique({
      where: { id: videosId },
  });

  if (!videosExists) {
      throw new ResponseError(400,'Videos not found.');
  }

  // Query the database for unique user count
  const users = await prismaClient.logVideos.findMany({
      where: whereCondition,
      select: {
          accessed_by: true,
      },
  });

  const uniqueUsers = new Set(users.map((user) => user.accessed_by));
  return uniqueUsers.size;
}

export default {
  getLogVideos,
  getOneLogVideos,
  deleteLogVideos,
  updateLogVideos,
  createVideos,
  countVideosAccessByOptionAndVideosId
};
