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
        emails:{
            type:String
        }
},{timestamps:true})

export default  mongoose.models.Notifications || mongoose.model('Notifications', userSchema);