import { NextResponse } from "next/server";
import connect from "../../../libs/mongo/index";
import Users from "../../../../model/userModel";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
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
            const updateData = await Users.updateOne(
              { email: payload?.email },
              { password: await bcrypt.hash(payload?.password, 10)
               }
            );
            if(updateData?.acknowledged === true){
            result = { status: 200 };
            }
            const user = {
              email: userExist?.email,
              password: await bcrypt.hash("payload?.password", 10)
            };
            
            const session = await encrypt({ user });
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            cookies().set("session", session, {
              httpOnly: true,
              expires: expiresAt,
            });
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
    console.log(error)
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);
export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}