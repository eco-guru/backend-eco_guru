import logVideosService from '../services/logVideo-service.js';
import userService from '../services/user-service.js';
import videoService from '../services/video-service.js';

const createLogVideos = async (req, res) => {
  try {
    const request = req.body;
    const result = await logVideosService.createVideos(request);
    return res.status(201).json({
      message: 'Log Videos created successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const createLogMobileVideos = async (req, res) => {
  try {
    if(req.body.token !== "VISITOR") {
      const users = await userService.getUserByToken(req.body.token);
  
      const videos = await videoService.getVideos();
      const video_id = videos.find(video => video.title === req.body.title);
  
      const request = {video_id: video_id.id, accessed_by: users.username};
      const result = await logVideosService.createVideos(request);
    }
    return res.status(201).json({
      message: 'Silahkan membaca artikel'
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const updateLogVideos = async (req, res) => {
  try {
        const request = req.body;
        request.video_id = req.params.video_id;
        request.accessed_by = req.params.accessed_by;
        const result = await logVideosService.updateLogVideos(request);
        return res.status(200).json({
        message: 'Log Videos updated successfully',
        data: result
        });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const deleteLogVideos = async (req, res) => {
  try {
    const request = {};
    request.video_id = req.params.video_id;
    request.accessed_by = req.params.accessed_by;
    const result = await logVideosService.deleteLogVideos(request);
    return res.status(200).json({
      message: 'Log Videos deleted successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const getLogVideos = async (req, res) => {
  try {
    const result = await logVideosService.getLogVideos();
    return res.status(200).json({
      message: 'Log Videos retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const getOneLogVideos = async (req, res) => {
  try {
    const request = {};
    request.video_id = req.params.video_id;
    request.accessed_by = req.params.accessed_by;
    const result = await logVideosService.getOneLogVideos(request);
    return res.status(200).json({
      message: 'Log Videos retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

async function countVideos(req, res) {
  try {
      const { videosId, option } = req.params;

      const count = await logVideosService.countVideosAccessByOptionAndVideosId(Number(videosId), option);

      res.status(200).json({
          message: 'Count retrieved successfully',
          success: true,
          data: count,
      });
  } catch (error) {
      res.status(500).json({
          message: 'Internal server error',
          success: false,
          message: error.message,
      });
  }
}

export default {
    createLogVideos,
    createLogMobileVideos,
    updateLogVideos,
    deleteLogVideos,
    getLogVideos,
    getOneLogVideos,
    countVideos
}