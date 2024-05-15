import { NextResponse } from "next/server";
import connect from '../../../libs/mongo/index'
import Users from '../../../../model/userModel'
import bcrypt from "bcrypt";
export const POST = async (request)=>{
    try{
     await connect();
     const user = await Users.find();   
     const payload = await request.json();      
     const data = await Users.findOne({ email: payload?.email })
     .then(async (userExist) => {
       if (userExist) {
        const password = await bcrypt.compare(payload?.otp,userExist?.passwordToken);
        const date = new Date();
        const toCompare = new Date(userExist?.passwordTokenExpire);          
        return time;
      }
       else{
        return 'false';
       }
     })
     .then((res) => {
       return res;
     });
     return new NextResponse(JSON.stringify(data), {status:200})     
    }
    catch(error){
        return new NextResponse("ERROR" + JSON.stringify(error), {status:500})     
    }
}