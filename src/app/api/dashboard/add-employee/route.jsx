import { NextResponse, NextRequest } from "next/server";
import connect from "../../../libs/mongo/index";
import Users from '../../../../model/userCreated';
import UsersData from '../../../../model/userData'
import bcrypt from "bcrypt";

export const POST = async (request) => {
  try {
    const db =  await connect();
    const payload = await request.json();
    const date = (new Date().getTime()).toString(36);
    const person = new Users({
      email: payload?.email,
      userID: date,
      password: await bcrypt.hash('fc@12356', 10)
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
      const userDataPerson = new UsersData({
        email: payload?.email,
        userID: date,
        name:payload?.name,
        joinDate:payload?.joinDate,
        designation:payload?.designation,
        role:payload?.role,
        gender:payload?.gender,
        department:payload?.department,
        DOB:payload?.DOB,
        incrementDate:payload?.incrementDate
          });

      return new NextResponse(JSON.stringify(result), { status: 200 });
    }
  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
