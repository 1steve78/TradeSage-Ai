import User from "../models/User.js"; // Removed curly braces
import { verifyAccessToken } from "../utils/jwt.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Check if header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        // 2. Check if the format is correct ("Bearer <token>")
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        // 3. Extract the token safely
        const token = authHeader.split(" ")[1];

        // 4. Verify token INSIDE the try block so it catches expired/invalid tokens
        const decoded = verifyAccessToken(token);
        
        // 5. Find the user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // 6. Attach user to request and proceed
        req.user = user;
        next();
        
    } catch (error) {
        // This will now successfully catch expired or tampered JWTs!
        console.error("Auth Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Not authorized, token failed",
        });
    }
};