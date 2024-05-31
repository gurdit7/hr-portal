import mongoose from "mongoose";
const { Schema} = mongoose;

const userSchema = new Schema({
        email:{
            type:String,
            required:true
        },
        subject:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        attachment:{
            type:String            
        },
        description:{
            type:String
        },
        sendDate:{
            type:String
        },
        toEmails:{
            type:Array
        },
        type:{
            type:String
        },
        id:{
            type:String
        },
        viewed:{
            type:Array
        }
},{timestamps:true})

export default  mongoose.models.Notifications || mongoose.model('Notifications', userSchema);