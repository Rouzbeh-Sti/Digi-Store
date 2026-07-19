const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const sellerRouter = require('./routes/sellerRoutes');
const buyerRouter = require('./routes/buyerRoutes');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const subscriptionRouter = require('./routes/subscriptionRoutes');
const recommendationRouter = require('./routes/recommendationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/buyer', buyerRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/recommendations', recommendationRouter);

app.get('/api/status', (req, res) => {
    res.json({ message: "System core refactored layout connected! 🚀" });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;