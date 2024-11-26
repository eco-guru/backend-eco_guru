import videosService from '../services/video-service.js';
import logVideoService from '../services/logVideo-service.js';

const createVideos = async (req, res) => {
  try {
    const request = req.body;
    console.log("WKWKKWKWKWKWK",request);
    const result = await videosService.postVideos(request);
    return res.status(201).json({
      message: 'Videos created successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const updateVideos = async (req, res) => {
  try {
        const request = req.body;
        request.id = req.params.id;
        const result = await videosService.updateVideos(request);
        return res.status(200).json({
        message: 'Videos updated successfully',
        data: result
        });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const deleteVideos = async (req, res) => {
  try {
    const request = req.params.id;
    const result = await videosService.deleteVideos(request);
    return res.status(200).json({
      message: 'Videos deleted successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const getVideos = async (req, res) => {
  try {
    const result = await videosService.getVideos();
    return res.status(200).json({
      message: 'Videos retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const extractYoutubeID = (url) => {
  const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const getMobileVideos = async (req, res) => {
  try {
    const results = await videosService.getVideos();
    const logs = await logVideoService.getLogVideos();
    const data = results.map((result) => {
      const logResult = logs.filter(log => log.video_id === result.id);
      return {...result, views: logResult.length || 0, url: `https://www.youtube.com/embed/${extractYoutubeID(result.url)}`};
    });
    return res.status(200).json({
      message: 'Video berhasil didapatkan',
      videos: data
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const getOneVideos = async (req, res) => {
  try {
    const request = req.params.id;
    const result = await videosService.getOneVideos(request);
    return res.status(200).json({
      message: 'Videos retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};


export default {
    createVideos,
    updateVideos,
    deleteVideos,
    getVideos,
    getOneVideos,
    getMobileVideos
}