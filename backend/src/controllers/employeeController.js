const EmployeeModel = require('../models/employeeModel');

const EmployeeController = {
  async getAll(req, res) {
    try {
      const employees = await EmployeeModel.getAll();
      res.json({ success: true, data: employees });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = EmployeeController;
