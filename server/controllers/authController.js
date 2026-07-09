import { registerUser ,loginUser} from "../services/authService.js";
import { refreshCookieOptions } from "../config/cookieOptions.js";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        // Pass the body down to the service
        const userData = await registerUser(req.body);
        
        // Send success response
        return res.status(201).json(userData);
    } catch (error) {
        // If the service throws an error (like "User already exists")
        if (error.message === "User already exists") {
            return res.status(400).json({ message: error.message });
        }
        console.error("Error in registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login =async(req,res)=>{
    try{
        const {user,accessToken,refreshToken} = await loginUser(req.body);
        // Cookie will be added here
        res.cookie(
            "refreshToken",
            refreshToken,
            refreshCookieOptions
        );
        //send response
        res.status(200).json({
            success : true,
            message : "Login successful",
            accessToken,
            user,
        });

    } catch(error){
        if (error.message === "Invalid credentials") {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
        
        console.error("Error in login:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getMe = async(req,res)=>{
    res.status(200).json({
        success : true,
        user : req.user,
    });
};

export const refreshToken = async (req, res) => {
    try {
        // 1. Grab the token from the secure cookie
        const currentRefreshToken = req.cookies.refreshToken;

        if (!currentRefreshToken) {
            return res.status(401).json({ 
                success: false, 
                message: "No refresh token found" 
            });
        }

        // 2. Verify it (this throws an error to the catch block if expired/tampered)
        const decoded = verifyRefreshToken(currentRefreshToken);

        // 3. Ensure the user still actually exists in the database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "User no longer exists" 
            });
        }

        // 4. Generate a fresh 15-minute Access Token
        const payload = {
            id: user._id,
            email: user.email
        };
        const newAccessToken = generateAccessToken(payload);

        // 5. Send it back!
        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error("Refresh Token Error:", error.message);
        // We use 403 Forbidden here to tell the frontend "Your refresh token is dead, force a log out"
        return res.status(403).json({ 
            success: false, 
            message: "Invalid or expired refresh token" 
        });
    }
};