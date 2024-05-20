import { NextResponse, NextRequest } from "next/server";
import connect from "../../../libs/mongo/index";
import UsersData from '../../../../model/userData'


export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();    
    let count = await UsersData.find().count().then((e)=>{
      if(e > 10){
        return e / payload?.limit;
      }
      else{
        return 0;
      }
    });
    
    const data = await UsersData.find().limit(payload?.limit).skip(payload?.limit * payload?.index).sort({$natural:-1});
    return new NextResponse(JSON.stringify({data:data,count:count}), { status: 200 });
  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
