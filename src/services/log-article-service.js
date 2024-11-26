import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createLogArticles,
  schemaUpdateLogArticle,
  schemaDeleteLogArticles,
  schemaCountArticles
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
    },
  });
};

const countArticleAccessByOptionAndArticleId = async (articleId, option) => {
  const params = validate(schemaCountArticles, { articleId, option });
  let whereCondition = { article_id: params.articleId };

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

  // Check if the article exists
  const articleExists = await prismaClient.articles.findUnique({
      where: { id: articleId },
  });

  if (!articleExists) {
      throw new ResponseError(400,'Article not found.');
  }

  // Query the database for unique user count
  const users = await prismaClient.logArticles.findMany({
      where: whereCondition,
      select: {
          accessed_by: true,
      },
  });

  const uniqueUsers = new Set(users.map((user) => user.accessed_by));
  return uniqueUsers.size;
}

export default {
  getLogArticles,
  getOneLogArticle,
  deleteLogArticle,
  updateLogArticle,
  createArticle,
  countArticleAccessByOptionAndArticleId
};
