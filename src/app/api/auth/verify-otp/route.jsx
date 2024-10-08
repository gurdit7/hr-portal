import { NextResponse } from "next/server";
import connect from "../../../libs/mongo/index";
import Users from "../../../../model/userModel";
import bcrypt from "bcrypt";
export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    const data = await Users.findOne({ email: payload?.email })
      .then(async (userExist) => {
        if (userExist) {
          const password = await bcrypt.compare(
            payload?.otp,
            userExist?.otpToken
          );
          const toCompare = new Date(userExist?.otpTokenExpire);
          const date = new Date();
          let result;
          if (password) {
            if (toCompare < date) {
              result = { error: "OTP Expired.", status: 410 };
            } else {
              const date = new Date();
              const minutesWithFive = date.getMinutes() + 30;        
              const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${date.getHours()}:${minutesWithFive}:${date.getSeconds()}`;
              const theTime = new Date(formattedDate); 
              const updateData = await Users.updateOne(
                { email: payload?.email },
                { passwordToken: await bcrypt.hash(payload?.otp, 10),
                  passwordTokenExpire:theTime
                 }
              );
              result = { status: 202 };
            }
          } else {
            result = { error: "OTP Not Matched.", status: 401 };
          }
          return result;
        } else {
          return false;
        }
      })
      .then((res) => {
        return res;
      });
    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
