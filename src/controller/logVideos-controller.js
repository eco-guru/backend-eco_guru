import logVideosService from '../services/logVideo-service.js';

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
    updateLogVideos,
    deleteLogVideos,
    getLogVideos,
    getOneLogVideos,
    countVideos
}