const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// میان‌افزارها (Middlewares)
app.use(cors()); // اجازه میده فرانت‌اند به این سرور وصل بشه
app.use(express.json()); // برای اینکه سرور بتونه فرمت JSON رو بخونه

// یک API تستی (متد GET)
app.get('/api/status', (req, res) => {
    res.json({ message: "سرور بک‌اند با موفقیت متصل شد و آماده کار است! 🚀" });
});

// تنظیم پورت
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});