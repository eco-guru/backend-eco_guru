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

const postArticle = async (request) => {
  request = validate(createArticles, request);

  const user = await prismaClient.users.findUnique({
    where: { username: request.created_by },
  });

  if (!user) {
    throw new ResponseError(400, "User not found");
  }

  const category = await prismaClient.articleCategory.findUnique({
    where: { id: request.categoryId },
  });

  if (!category) {
    throw new ResponseError(400, "Category not found");
  }

  const article = await prismaClient.articles.create({
    data: {
      title: request.title,
      content: request.content,
      isPublished: request.isPublished,
      created_date: request.created_date,
      article_order: request.article_order,
      thumbnail_url: request.thumbnail_url,
      category: {
        connect: { id: request.categoryId },
      },
      user: {
        connect: { username: request.created_by },
      },
    },
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

  if (request.created_by) {
    const user = await prismaClient.users.findUnique({
      where: { username: request.created_by },
    });
    if (!user) {
      throw new ResponseError(400, "User not found");
    }
  }

  if (request.categoryId) {
    const category = await prismaClient.articleCategory.findUnique({
      where: { id: request.categoryId },
    });
    if (!category) {
      throw new ResponseError(400, "Category not found");
    }
  }

  const updatedArticle = await prismaClient.articles.update({
    where: { id: request.id },
    data: {
      title: request.title,
      content: request.content,
      isPublished: request.isPublished,
      created_by: request.created_by,
      created_date: request.created_date,
      article_order: request.article_order,
      thumbnail_url: request.thumbnail_url,
      categoryId: request.categoryId,
    },
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
