import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const getVideoCategory = async () => {
    const category = await prismaClient.videoCategory.findMany({
        select: {
            id: true,
            category: true
        }
    })
    if (!category) {
        throw new ResponseError(404, "Question unlisted");
    }

    return category;
}

const getArticleCategory = async () => {
    const category = await prismaClient.articleCategory.findMany({
        select: {
            id: true,
            category: true
        }
    })
    if (!category) {
        throw new ResponseError(404, "Question unlisted");
    }

    return category;
}

export const categoryService = { getArticleCategory, getVideoCategory }