import express from 'express';
import videosController from '../../controller/videos-controller.js';
import logVideosController from '../../controller/logVideos-controller.js';

export const videoMobileRouter = express.Router();

videoMobileRouter.get('/videos', videosController.getMobileVideos);
videoMobileRouter.post('/trigger-videos', logVideosController.createLogMobileVideos);