import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createLogArticles,
  schemaUpdateLogArticle,
  schemaDeleteLogArticles
} from "../validation/logArticle-validation.js";

const getLogArticles = async () => {
  const logArticles = await prismaClient.logArticles.findMany({
    select: {
      article_id: true,
      accessed_by: true,
      accessed_time: true,
    },
  });

  if (!logArticles) {
    throw new ResponseError(404, "Log articles not found");
  }

  return logArticles;
};

// Mendapatkan satu log artikel berdasarkan artikel_id dan accessed_by
const getOneLogArticle = async (request) => {
  request = validate(schemaDeleteLogArticles, request);
  console.log(request);
  const logArticle = await prismaClient.logArticles.findMany({
    where: {
      article_id: request.article_id,
      accessed_by: request.accessed_by,
    },
  });

  if (!logArticle) {
    throw new ResponseError(404, "Log article not found");
  }

  return logArticle;
};

// Menghapus log artikel berdasarkan artikel_id dan accessed_by
const deleteLogArticle = async (request) => {
  request = validate(schemaDeleteLogArticles, request);

  const logArticle = await prismaClient.logArticles.findMany({
    where: {
      article_id: request.article_id,
      accessed_by: request.accessed_by,
    },
  });

  if (!logArticle) {
    throw new ResponseError(404, "Log article not found");
  }

  const deleteData = await prismaClient.logArticles.deleteMany({
    where: {
      article_id: request.article_id,
      accessed_by: request.accessed_by,
    },
  });

  return deleteData;
};

// Memperbarui waktu akses pada log artikel
const updateLogArticle = async (request) => {
  request = validate(schemaUpdateLogArticle, request);

  const logArticle = await prismaClient.logArticles.findFirst({
    where: {
      article_id: request.article_id,
      accessed_by: request.accessed_by,
      accessed_time: request.accessed_time_old,
    },
  });

  if (!logArticle) {
    throw new ResponseError(404, "Log article not found");
  }

  const updatedLogArticle = await prismaClient.logArticles.update({
    where: {
      article_id_accessed_by_accessed_time: {
        article_id: request.article_id,
        accessed_by: request.accessed_by,
        accessed_time: request.accessed_time_old,
      },
    },
    data: {
      accessed_time: request.accessed_time_new,
    },
  });

  return updatedLogArticle;
};

const createArticle = async (request) => {
  request = validate(createLogArticles, request);

  const articlesData = await prismaClient.articles.findFirst({
    where:{
      id: request.article_id
    }
  });

  if(!articlesData){
    throw new ResponseError(404, "Article not found");
  }

  // Jika belum ada, buat log artikel baru
  return await prismaClient.logArticles.create({
    data: {
      article_id: request.article_id,
      accessed_by: request.accessed_by,
      accessed_time: request.accessed_time,
    },
  });
};

export default {
  getLogArticles,
  getOneLogArticle,
  deleteLogArticle,
  updateLogArticle,
  createArticle
};
