const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const sellerRouter = require('./routes/sellerRoutes');
const buyerRouter = require('./routes/buyerRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRouter); 
app.use('/api/products', productRouter); 
app.use('/api/seller', sellerRouter);
app.use('/api/buyer', buyerRouter);
app.use('/api/admin', adminRouter); 

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