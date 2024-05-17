import { NextResponse } from "next/server";
import { cookies } from 'next/headers'


export const POST = async (request)=>{
    try{
     cookies().delete('session');
     return new NextResponse(JSON.stringify({success:true}), {status:200})     
    }
    catch(error){
        console.log("error>>",error)
        return new NextResponse("ERROR" + JSON.stringify(error), {status:500})     
    }
}