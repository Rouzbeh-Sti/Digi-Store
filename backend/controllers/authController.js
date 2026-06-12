const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Handle user registration logic
const registerUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // 1. Check if user already exists in the database
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists!" });
        }

        // 2. Create new user in the database
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: password, 
                role: role || "BUYER"
            }
        });

        // 3. Send success response back to the client
        res.status(201).json({ message: "User registered successfully", user: newUser });
        
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
};

// Handle user login logic
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        // 2. Check if user exists and password matches
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 3. Send success response
        res.status(200).json({ message: "Login successful", user: user });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
};

// Export functions to be used in routes
module.exports = { registerUser, loginUser };