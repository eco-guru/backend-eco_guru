import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  getArticleValidation,
  postAndUpdateArticleValidation,
} from "../validation/article-validation.js";
import LogArticlesServices from "./log-article-service.js"


// Mendapatkan semua artikel
const getArticles = async () => {
  const articles = await prismaClient.articles.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      category: true,
      isPublished: true,
      created_by: true,
      created_date: true,
      article_order: true,
    },
  });

  if (!articles) {
    throw new ResponseError(404, "Articles not found");
  }

  return articles;
};

// Menambahkan artikel baru
const postArticle = async (request) => {
  request = validate(postAndUpdateArticleValidation, request);

  const user = await prismaClient.users.findUnique({
    where: { username: request.created_by },
  });

  if (!user) {
    throw new ResponseError(400, "User not found");
  }

  const article = await prismaClient.articles.create({
    data: request,
  });

  return article;
};

// Memperbarui artikel berdasarkan ID
const updateArticle = async (request) => {
  request = validate(postAndUpdateArticleValidation, request);

  const article = await prismaClient.articles.findUnique({
    where: { id: request.id },
  });

  if (!article) {
    throw new ResponseError(404, "Article not found");
  }

  const updatedArticle = await prismaClient.articles.update({
    where: { id: request.id },
    data: request,
  });

  return updatedArticle;
};

// Menghapus artikel berdasarkan ID
const deleteArticle = async (request) => {
  request = validate(getArticleValidation, request);

  const article = await prismaClient.articles.findUnique({
    where: { id: request.id },
  });

  if (!article) {
    throw new ResponseError(404, "Article not found");
  }

  await prismaClient.articles.delete({
    where: { id: request.id },
  });

  return { message: "Article deleted successfully" };
};

const getOneArticle = async (request) => {
  request = validate(getArticleValidation, request);
  const article = await prismaClient.articles.findUnique({
    where: { id: request.id },
  });

  if (!article) {
    throw new ResponseError(404, "Article not found");
  }

  await createOrUpdateLogArticle({
    article_id: article.id,
    accessed_by: request.username,
    accessed_time: request.duration || 1,
  });

  return article;
};

export default {
  getArticles,
  getOneArticle,
  postArticle,
  updateArticle,
  deleteArticle,
};
