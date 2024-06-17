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
            payload?.password,
            userExist?.password
          );
          const toCompare = new Date(userExist?.passwordTokenExpire);
          const date = new Date();
          let result;
          if (password) {
            result = { error: "This is your current password.", status: 403 };         
          }
           else {
            if (toCompare < date) {
              result = { error: "Session Expired.", status: 440  };
            } else {
              const updateData = await Users.updateOne(
                { email: payload?.email },
                { password: await bcrypt.hash(payload?.password, 10)
                 }
              );    
              if(updateData?.acknowledged === true){
              result = { status: 200 };
              }
            }
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
    console.log(error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
