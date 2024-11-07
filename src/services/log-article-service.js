import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  getLogArticleValidation,
  postLogArticleValidation,
} from "../validation/log-article-validation.js";

// Mendapatkan semua data log artikel
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
  request = validate(getLogArticleValidation, request);
  const logArticle = await prismaClient.logArticles.findFirst({
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

// Menambahkan log artikel baru
const postLogArticle = async (request) => {
  request = validate(postLogArticleValidation, request);

  // Pastikan artikel terkait ada di database
  const article = await prismaClient.articles.findFirst({
    where: { id: request.article_id },
  });

  if (!article) {
    throw new ResponseError(400, "Article not found");
  }

  const logArticle = await prismaClient.logArticles.create({
    data: request,
  });

  return logArticle;
};

// Menghapus log artikel berdasarkan artikel_id dan accessed_by
const deleteLogArticle = async (request) => {
  request = validate(getLogArticleValidation, request);

  const logArticle = await prismaClient.logArticles.findFirst({
    where: {
      article_id: request.article_id,
      accessed_by: request.accessed_by,
    },
  });

  if (!logArticle) {
    throw new ResponseError(404, "Log article not found");
  }

  await prismaClient.logArticles.delete({
    where: {
      article_id_accessed_by: {
        article_id: request.article_id,
        accessed_by: request.accessed_by,
      },
    },
  });

  return { message: "Log article deleted successfully" };
};

// Memperbarui waktu akses pada log artikel
const updateLogArticle = async (request) => {
  request = validate(postLogArticleValidation, request);

  const logArticle = await prismaClient.logArticles.findFirst({
    where: {
      article_id: request.article_id,
      accessed_by: request.accessed_by,
    },
  });

  if (!logArticle) {
    throw new ResponseError(404, "Log article not found");
  }

  const updatedLogArticle = await prismaClient.logArticles.update({
    where: {
      article_id_accessed_by: {
        article_id: request.article_id,
        accessed_by: request.accessed_by,
      },
    },
    data: {
      accessed_time: request.accessed_time,
    },
  });

  return updatedLogArticle;
};

const createOrUpdateLogArticle = async (request) => {
  request = validate(postLogArticleValidation, request);

  // Cek apakah log artikel sudah ada
  const existingLogArticle = await prismaClient.logArticles.findFirst({
    where: {
      article_id: request.article_id,
      accessed_by: request.accessed_by,
    },
  });

  // Jika sudah ada, tambahkan durasi waktu aksesnya
  if (existingLogArticle) {
    const existingDuration = existingLogArticle.accessed_time;
    const newTotalDuration = existingDuration + request.accessed_time;

    return await prismaClient.logArticles.update({
      where: {
        article_id_accessed_by: {
          article_id: request.article_id,
          accessed_by: request.accessed_by,
        },
      },
      data: {
        accessed_time: newTotalDuration,
      },
    });
  }

  // Jika belum ada, buat log artikel baru
  return await prismaClient.logArticles.create({
    data: {
      article_id: request.article_id,
      accessed_by: request.accessed_by,
      accessed_time: request.accessed_time, // Menyimpan durasi awal dalam menit
    },
  });
};

export default {
  getLogArticles,
  getOneLogArticle,
  postLogArticle,
  deleteLogArticle,
  updateLogArticle,
  createOrUpdateLogArticle
};
