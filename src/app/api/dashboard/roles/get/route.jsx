import { NextResponse } from "next/server";
import connect from "../../../../libs/mongo/index";
import Roles from '../../../../../model/addRole'


export const GET = async (request) => {
  try {
     await connect();
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
  } catch (error) {    
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
