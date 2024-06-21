import mongoose from "mongoose";

const { Schema} = mongoose;
const requestDocumentSchema = new Schema({
        email:{
            type:String,
            required:true
        },
        userID:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        document:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        status:{
            type:String
        },
        attachment:{
            type:String
        }            

},{timestamps:true})

export default  mongoose.models.RequestDocuments || mongoose.model('RequestDocuments', requestDocumentSchema);