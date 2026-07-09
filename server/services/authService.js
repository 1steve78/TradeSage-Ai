import bcrypt from "bcrypt";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";

// We accept the data directly, no req/res needed here!
export const registerUser = async ({ name, email, password }) => { 
    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        // Throw an error back to the controller
        throw new Error("User already exists");
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user in the database
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    // 4. Return the user data to the controller
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        riskProfile: user.riskProfile,
    };
};

export const loginUser = async({email,password})=>{
    const user =  await User.findOne({email});

    if(!user){
        throw  new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if(!isMatch){
        throw new Error("Invalid Credentials");
    }

    const payload={
        id:user._id,
        email : user.email

    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    return {
        user :{
            id : user._id,
            name : user.name,
            email : user.email,
            avatar : user.avatar,
            riskProfile : user.riskProfile,
        },
        accessToken,
        refreshToken,
    };
}