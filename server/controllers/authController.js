import { registerUser ,loginUser} from "../services/authService.js";
import { refreshCookieOptions } from "../config/cookieOptions.js";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwt.js";
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import logger from "../infrastructure/logger.js";

export const register = catchAsync(async (req, res) => {
    try {
        const userData = await registerUser(req.body);
        logger.info(`[AUDIT] User registered successfully: ${userData.email}`);
        return res.status(201).json({ success: true, data: userData });
    } catch (error) {
        if (error.message === "User already exists") {
            logger.warn(`[AUDIT] Failed registration attempt (user exists): ${req.body.email}`);
            throw new AppError(error.message, 400, "USER_EXISTS");
        }
        throw error; // Will be caught by catchAsync and globalErrorHandler
    }
});

export const login = catchAsync(async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await loginUser(req.body);
        
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);
        
        logger.info(`[AUDIT] User login successful: ${user.email} from IP: ${req.ip}`);

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user,
        });
    } catch (error) {
        if (error.message === "Invalid credentials") {
            logger.warn(`[AUDIT] Failed login attempt (invalid credentials) for: ${req.body.email} from IP: ${req.ip}`);
            throw new AppError(error.message, 401, "INVALID_CREDENTIALS");
        }
        throw error;
    }
});

export const getMe = catchAsync(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

export const refreshToken = catchAsync(async (req, res) => {
    const currentRefreshToken = req.cookies.refreshToken;

    if (!currentRefreshToken) {
        throw new AppError("No refresh token found", 401, "NO_TOKEN");
    }

    try {
        const decoded = verifyRefreshToken(currentRefreshToken);
        const user = await User.findById(decoded.id).lean();
        
        if (!user) {
            throw new AppError("User no longer exists", 401, "USER_NOT_FOUND");
        }

        const payload = {
            id: user._id,
            email: user.email
        };
        const newAccessToken = generateAccessToken(payload);

        logger.info(`[AUDIT] Token refreshed for user: ${user.email}`);

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });
    } catch (error) {
        logger.warn(`[AUDIT] Failed token refresh attempt from IP: ${req.ip} - ${error.message}`);
        // We use 403 Forbidden here to tell the frontend "Your refresh token is dead, force a log out"
        throw new AppError("Invalid or expired refresh token", 403, "INVALID_REFRESH_TOKEN");
    }
});