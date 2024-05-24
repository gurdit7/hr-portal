import { NextResponse } from "next/server";
import connect from "../../../../libs/mongo/index";
import userData from "../../../../../model/userData";
export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if(payload?.profileImageLabel === 'coverImage'){
    const updateData = await userData
      .updateOne(
        { email: payload?.email },
        {
          coverImage: payload?.coverImage,
        }
      )
      .then(async () => {
        const data = await userData
          .findOne({ email: payload?.email })
          .then(async (userExist) => {
            return userExist;
          })
          .then((res) => {
            return res;
          });
          return data;
      }).then((res) => {
        return res;
      });
      return new NextResponse(JSON.stringify(updateData), { status: 200 });
    }
    else{
      const updateData = await userData
      .updateOne(
        { email: payload?.email },
        {
          profileImage: payload?.profileImage,
        }
      )
      .then(async () => {
        const data = await userData
          .findOne({ email: payload?.email })
          .then(async (userExist) => {
            return userExist;
          })
          .then((res) => {
            return res;
          });
          return data;
      }).then((res) => {
        return res;
      });
      return new NextResponse(JSON.stringify(updateData), { status: 200 });
    }
   
  } catch (error) {
    console.log(error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
