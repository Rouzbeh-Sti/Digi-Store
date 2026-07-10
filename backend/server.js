const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import route files
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');

const app = express();

// 2. Middlewares
app.use(cors()); // Allow frontend to connect to this server
app.use(express.json()); // Parse incoming JSON payloads

// 3. Register routes
app.use('/api/auth', authRouter); // Map all /api/auth requests to authRouter
app.use('/api/products', productRouter); // Map all /api/products requests to productRouter
app.use('/api/orders', orderRouter); // Map all /api/orders requests to orderRouter
app.use('/api/dashboard', dashboardRouter); // Map all /api/dashboard requests to dashboardRouter

// Test API (GET method)
app.get('/api/status', (req, res) => {
    res.json({ message: "Backend server is connected and ready! 🚀" });
});

// 4. Server configuration
// Only listen to the port if we are NOT running tests
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app so Supertest can use it
module.exports = app;