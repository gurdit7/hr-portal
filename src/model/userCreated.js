import mongoose from "mongoose";

const { Schema} = mongoose;

const userSchema = new Schema({
        email:{
            type:String,
            required:true
        },
        userID:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }

},{timestamps:true})

export default  mongoose.models.Users || mongoose.model('Users', userSchema);