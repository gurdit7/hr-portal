import { NextResponse, NextRequest } from "next/server";
import connect from "../../../../libs/mongo/index";
import Roles from '../../../../../model/addRole'


export const POST = async (request) => {
  try {
    const db =  await connect();
    const payload = await request.json();
    const person = new Roles({
        role: payload?.role,
        permissions: payload?.permissions
    });
    const data = await Roles.findOne({ role: payload?.role })
      .then( async (userExist) => {
        if (userExist) {
          return { success: false, status:403, userExist:userExist };
        }
        else{
            await person.save();   
            return { success: true, status:200 }
        }
      })
      .then((res) => {
        return res;
      });
      return new NextResponse(JSON.stringify(data), { status: 500 });
  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
