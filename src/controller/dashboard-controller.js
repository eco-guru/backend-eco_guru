import dashboardService from "../services/dashboard-service.js";

const DashboardController= async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const dashboardData = await dashboardService.getDashboardData(startDate, endDate);
      
      res.status(200).json({
        status: 'success',
        data: dashboardData
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
}

export default{
    DashboardController
};