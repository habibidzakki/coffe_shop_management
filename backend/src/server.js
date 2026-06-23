const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const menuRoutes = require('./routes/menuRoutes');
const customerRoutes = require('./routes/customerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const redirectRoutes = require('./routes/redirectRoutes');
const reportRoutes = require('./routes/reportRoutes');
const mejaRoutes = require('./routes/mejaRoutes');
const ingRoutes = require('./routes/ingRoutes');
const baristaRoutes = require('./routes/baristaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menampilkan frontend langsung dari Express.
app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Coffee Shop Management API berjalan',
    endpoints: {
      menus: '/api/menus',
      categories: '/api/categories',
      customers: '/api/customers',
      employees: '/api/employees',
      orders: '/api/orders',
      dashboard: '/api/reports/dashboard',
      redirect_google: '/api/redirect/google'
    }
  });
});

app.use('/api', menuRoutes);
app.use('/api', customerRoutes);
// app.use('/api', employeeRoutes); // Replacing employee with barista
app.use('/api', orderRoutes);
app.use('/api', reportRoutes);
app.use('/api', redirectRoutes);
app.use('/api', mejaRoutes);
app.use('/api', ingRoutes);
app.use('/api', baristaRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
