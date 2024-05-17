import mongoose from "mongoose";

const { Schema} = mongoose;
const userSchema = new Schema({
    userType:{
            type:String,
            required:true
        },
        userID:{
            type:String
        },        
        email:{
            type:String
        },
        name:{
            type:String,
            required:true
        },
        joinDate:{
            type:String,
            required:true
        },
        designation:{
            type:String,
            required:true
        },
        role:{
            type:String,
            required:true
        },
        gender:{
            type:String,
            required:true
        },
        department:{
            type:String,
            required:true
        },
        DOB:{
            type:String,
            required:true
        },
        incrementDate:{
            type:String,
            required:true
        },
        status:{
            type:String
        }
},{timestamps:true})

export default  mongoose.models.UsersData || mongoose.model('UsersData', userSchema);