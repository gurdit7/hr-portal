import { NextResponse } from "next/server";
import connect from "@/app/libs/mongo";
import Users from '../../../../model/userModel'
export const POST = async (request)=>{
    try{
     await connect();
     const payload = await request.json(); 
     const data = await Users.findOne({ email: payload?.email })
     .then(async (userExist) => {
       if (userExist) {

       }
       else{
        return {error:'User Not Found'}
       }
     })
     .then((res) => {
       return res;
     });
     return new NextResponse(JSON.stringify(data), {status:200})     
    }
    catch(error){
        console.log("error>>",error)
        return new NextResponse("ERROR" + JSON.stringify(error), {status:500})     
    }
}