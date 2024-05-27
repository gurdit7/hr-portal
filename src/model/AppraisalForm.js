import mongoose from "mongoose";

const { Schema} = mongoose;
const appraisalForm = new Schema({
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
        ExpectedSalary:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        status:{
            type:String
        }         

},{timestamps:true})

export default  mongoose.models.AppraisalForm || mongoose.model('AppraisalForm', appraisalForm);