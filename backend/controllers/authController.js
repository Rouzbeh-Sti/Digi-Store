const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Register a new user and handle extra fields for sellers
const registerUser = async (req, res) => {
    try {
        // Extract all fields from request body including the new seller ones
        const { email, password, fullName, role, storeName, phone, bio } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "لطفا تمام فیلدهای اصلی را وارد کنید." });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "این ایمیل قبلا در سیستم ثبت شده است." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user and inject the optional seller details if they exist
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                fullName: fullName,
                role: role || "BUYER",
                storeName: storeName || null,
                phone: phone || null,
                bio: bio || null
            }
        });

        const { password: _, ...userWithoutPassword } = newUser;

        const payload = {
            userId: newUser.id,
            role: newUser.role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({ 
            message: "ثبت نام شما با موفقیت انجام شد!", 
            token: token,
            user: userWithoutPassword 
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "خطایی در سرور هنگام ثبت نام رخ داد." });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "وارد کردن ایمیل و رمز عبور الزامی است." });
        }

        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(401).json({ message: "ایمیل یا رمز عبور اشتباه است." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "ایمیل یا رمز عبور اشتباه است." });
        }

        const payload = {
            userId: user.id,
            role: user.role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "ورود با موفقیت انجام شد.",
            token: token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "خطایی در سرور هنگام ورود رخ داد." });
    }
};

module.exports = { registerUser, loginUser };