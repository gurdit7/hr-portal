import mongoose from "mongoose";

const { Schema} = mongoose;
const userSchema = new Schema({
    duration:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        subject:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        attachment:{
            type:String
        },
        status:{
            type:String
        },
        name:{
            type:String
        },
        from:{
            type:String
        },
        to:{
            type:String
        }            

},{timestamps:true})

export default  mongoose.models.Leaves || mongoose.model('Leaves', userSchema);