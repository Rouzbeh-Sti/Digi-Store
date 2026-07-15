const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Update basic user profile information
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { fullName, storeName, phone, bio } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
                fullName,
                ...(req.user.role === 'SELLER' && { storeName, phone, bio })
            }
        });

        // Strip password before returning
        const { password, ...safeUser } = updatedUser;

        res.status(200).json({ 
            message: "اطلاعات پروفایل با موفقیت بروزرسانی شد.", 
            user: safeUser 
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "خطا در ثبت تغییرات. لطفا مجددا تلاش کنید." });
    }
};

// Secure password change functionality
const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "وارد کردن رمز عبور فعلی و جدید الزامی است." });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "رمز عبور فعلی اشتباه است." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });

        res.status(200).json({ message: "رمز عبور شما با موفقیت تغییر کرد." });
    } catch (error) {
        console.error("Password Change Error:", error);
        res.status(500).json({ message: "خطا در تغییر رمز عبور سیستم." });
    }
};

module.exports = { updateProfile, changePassword };