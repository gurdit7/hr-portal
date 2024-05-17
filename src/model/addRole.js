import mongoose from "mongoose";

const { Schema} = mongoose;
const userSchema = new Schema({
    role:{
            type:String,
            required:true
        },
        permissions:{
            type:Array,
            required:true
        }  

},{timestamps:true})

export default  mongoose.models.Roles || mongoose.model('Roles', userSchema);