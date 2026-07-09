import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Name is required"],
            trim : true,
            minlength:[2,"Name must be atleast 2 characters"],
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique : true,
            trime : true,
            lowercase:true,
        },
        password:{
            type:String,
            required:[true,"Password is required"],
            minlength:[8,"Password must be atleast 8 characters"],
        },
        avatar :{
            type:String,
            default:"",
        },
        riskProfile:{
            type:String,
            enum :["Low","Medium","High"],
            default:"Medium",
        },
    },
    {
        timestamps:true,
    }
);

const User  =mongoose.model("User",userSchema);

export default User;