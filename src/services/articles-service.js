import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  UpdateArticles,
  createArticles,
  getAndDeleteArticles,
} from "../validation/article-validation.js";

// Mendapatkan semua artikel
const getArticles = async () => {
  const articles = await prismaClient.articles.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      categoryId: true,
      isPublished: true,
      created_by: true,
      created_date: true,
      article_order: true,
      thumbnail_url: true,
    },
    where: {
      isPublished: true,
    }
  });

  if (!articles) {
    throw new ResponseError(404, "Articles not found");
  }

  return articles;
};

// Menambahkan artikel baru
const postArticle = async (request) => {
  request = validate(createArticles, request);

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
  request = validate(UpdateArticles, request);

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
  request = validate(getAndDeleteArticles, request);

  const article = await prismaClient.articles.findUnique({
    where: { id: request },
  });

  if (!article) {
    throw new ResponseError(404, "Article not found");
  }

  const deleteData = await prismaClient.articles.delete({
    where: { id: request },
  });

  return deleteData;
};

const getOneArticle = async (request) => {
  request = validate(getAndDeleteArticles, request);
  const article = await prismaClient.articles.findUnique({
    where: { id: request },
  });

  if (!article) {
    throw new ResponseError(404, "Article not found");
  }

  const data = await prismaClient.articles.findUnique({
    where: { id: request },
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

  return data;
};

export default {
  getArticles,
  getOneArticle,
  postArticle,
  updateArticle,
  deleteArticle,
};
