import { NextResponse } from "next/server";
import connect from "../../../../libs/mongo/index";
import Roles from '../../../../../model/addRole'
import userData from "@/model/userData";


export const GET = async (request) => {
  try {
     await connect();
     const url = new URL(request.url);
     const key = url.searchParams.get("key");
     if(key){
     const user = await userData.findOne({_id: key, status:'active'});
     if(user){
    const data = await Roles.find()
      .then( async (userExist) => {
        if (userExist) {
          return { success: false, status:403, role:userExist };
        }
        else{
       
            return { success: true, status:200 }
        }
      })
      .then((res) => {
        return res;
      });
      return new NextResponse(JSON.stringify(data), { status: 200 });
    }
    else{
      return new NextResponse(JSON.stringify({ error:"Invalid api key." }), {
        status: 200,
      });
    }
    }
    else{
      return new NextResponse(JSON.stringify({ error:"Please add a API key." }), {
        status: 200,
      });
    }
  } catch (error) {  
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
