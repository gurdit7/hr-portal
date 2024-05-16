import mongoose from "mongoose";

const { Schema} = mongoose;

const userSchema = new Schema({
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        otpTokenExpire:{
            type:String
        },
        otpToken:{
            type:String
        },
        passwordTokenExpire:{
            type:String
        },
        passwordToken:{
            type:String
        },
        userID:{
            type:String
        }

},{timestamps:true})

export default  mongoose.models.Users || mongoose.model('Users', userSchema);