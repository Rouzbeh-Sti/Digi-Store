const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import route files
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');

const app = express();

// 2. Middlewares
app.use(cors()); // Allow frontend to connect to this server
app.use(express.json()); // Parse incoming JSON payloads

// 3. Register routes
app.use('/api/auth', authRouter); // Map all /api/auth requests to authRouter
app.use('/api/products', productRouter); // Map all /api/products requests to productRouter
app.use('/api/orders', orderRouter); // Map all /api/orders requests to orderRouter

// Test API (GET method)
app.get('/api/status', (req, res) => {
    res.json({ message: "Backend server is connected and ready! 🚀" });
});

// 4. Server configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});