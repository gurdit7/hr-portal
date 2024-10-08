import { NextResponse } from "next/server";
import connect from '../../../libs/mongo/index'
import userData from '../../../../model/userData'
import Roles from '../../../../model/addRole'
export const POST = async (request)=>{
    try{
     await connect();
     const payload = await request.json(); 
     const data = await userData?.findOne({ userID: payload?.userID })
     .then(async (userExist) => {
       if (userExist) {
            const data = await Roles.findOne({ role: userExist?.role });            
            return {user:userExist , permissions: data?.permissions};
       }
       else{
        return {error:'User Not Found', status:404}
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


export const GET = async (request)=>{
  try{
   await connect();   
   const url = new URL(request.url);
   const userID = url.searchParams.get('userID');
   if (!userID) {
    return new NextResponse(JSON.stringify({ error: 'User ID not provided' }), { status: 400 });
  }
   const data = await userData?.findOne({ userID: userID })
   .then(async (userExist) => {
     if (userExist) {       
          return userExist;
     }
     else{
      return {error:'User Not Found', status:404}
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
