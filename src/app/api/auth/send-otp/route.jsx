import { NextResponse } from "next/server";
import connect from "@/app/libs/mongo";
import Users from "../../../../model/userModel";
import bcrypt from "bcrypt";
export const POST = async (request) => {
  try {
    const date = new Date();
    const minutesWithFive = date.getMinutes() + 5;        
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${date.getHours()}:${minutesWithFive}:${date.getSeconds()}`;
    const theTime = new Date(formattedDate); 
    await connect();
    const payload = await request.json();
    const updateData = await Users.updateOne(
      { email: payload?.email },
      { otpToken: await bcrypt.hash(payload?.otp, 10),
        otpTokenExpire:theTime
       }
    );
    return new NextResponse(JSON.stringify(updateData), { status: 200 });
  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
