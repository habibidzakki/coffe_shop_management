const ReportModel = require('../models/reportModel');

const reportController = {
  async getDashboardData(req, res) {
    try {
      const filter = req.query.filter || 'all';
      const bestSellers = await ReportModel.getBestSellers();
      const recentRevenue = await ReportModel.getRecentRevenue();
      const totalFilteredRevenue = await ReportModel.getTotalRevenue(filter);
      
      res.json({
        success: true,
        data: {
          bestSellers,
          recentRevenue,
          totalFilteredRevenue
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data dashboard'
      });
    }
  }
};

module.exports = reportController;
