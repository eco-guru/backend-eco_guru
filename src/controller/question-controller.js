import { questionService } from '../services/question-service.js';

const getQuestion = async (req, res) => {
    const listQuestion = await questionService.getQuestion();
    return res.status(201).json({
        data: listQuestion
    });
}

export const questionController = { getQuestion }