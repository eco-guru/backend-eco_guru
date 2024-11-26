import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const getQuestion = async () => {
    const question = await prismaClient.secretQuestion.findMany({
        select: {
            question_id: true,
            question_text: true
        }
    })
    if (!question) {
        throw new ResponseError(404, "Question unlisted");
    }

    return question;
}

export const questionService = { getQuestion }