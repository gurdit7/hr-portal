import { NextResponse, NextRequest } from "next/server";
import connect from "../../../libs/mongo/index";
import Leaves from "@/model/addLeave";
import UsersData from "@/model/userData";

export const POST = async (request) => {
  try {
    const db =  await connect();
    const payload = await request.json();
    const date = (new Date().getTime()).toString(36);
    const leaves = new Leaves({
      name:payload?.name,
      email: payload?.email,
      userID: payload?.userID,
      duration: payload?.duration,
      subject: payload?.subject,
      description: payload?.description,
      attachment: payload?.attachment,
      from: payload?.from,
      to: payload?.to,
      status: 'pending'
    });
    const result = await leaves.save();
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};



export const GET = async (request) => {
    try {
      const db =  await connect();
      const url = new URL(request.url);
   const email = url.searchParams.get('email');
   if (!email) {
    return new NextResponse(JSON.stringify({ error: 'Email not provided' }), { status: 400 });
  }
      const date = (new Date().getTime()).toString(36);
      const leaves = await Leaves.find({ email: email }).sort({$natural:-1}).then(async (data) => {
        if (data) {   
           const userData =  await UsersData.findOne({ email: email }).then(async (data) => {            
              return {
                name:data?.name,
                email:data?.email
             };
            });
             return {leaves:data, user:userData};
        }
        else{
         return {error:'User Not Found', status:404}
        }
      })
      .then((res) => {
        return res;
      });;
      return new NextResponse(JSON.stringify(leaves), { status: 200 });
    } catch (error) {
      console.log("error>>", error);
      return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
    }
  };