import { NextResponse, NextRequest } from "next/server";
import connect from "../../../libs/mongo/index";
import Users from '../../../../model/userCreated';
import bcrypt from "bcrypt";
import { cookies } from 'next/headers'

export const POST = async (request) => {
  try {
    const db =  await connect();
    const payload = await request.json();
    const date = (new Date().getTime()).toString(36);
    const person = new Users({
      email: payload?.email,
      userID: date,
      password: await bcrypt.hash(payload?.password, 10)
    });
    const data = await Users.findOne({ email: payload?.email })
      .then((userExist) => {
        if (userExist) {
          return { user: true };
        }
      })
      .then((res) => {
        return res;
      });
    if (data?.user === true) {
        data.message =  'User Already Exist';
      return new NextResponse(JSON.stringify(data), { status: 200 });
    } else {
      const result = await person.save();
      result.message =  'User Registerd';
      return new NextResponse(JSON.stringify(result), { status: 200 });
    }
  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
