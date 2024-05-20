import { NextResponse, NextRequest } from "next/server";
import connect from "../../../libs/mongo/index";
import UsersData from "../../../../model/userData";

export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.sort === true && payload?.userType !== "all") {
      let count = await UsersData.find({ userType: payload?.userType })
        .count()
        .then((e) => {
          if (e > 10) {
            return e / payload?.limit;
          } else {
            return 0;
          }
        });
      const data = await UsersData.find({ userType: payload?.userType })
        .limit(payload?.limit)
        .skip(payload?.limit * payload?.index).sort({$natural:-1});
      return new NextResponse(JSON.stringify({ data: data, count: count }), {
        status: 200,
      });
    }
    if (payload?.userType === "all") {
      let count = await UsersData.find()
        .count()
        .then((e) => {
          if (e > 10) {
            return e / payload?.limit;
          } else {
            return 0;
          }
        });
      const data = await UsersData.find()
        .limit(payload?.limit)
        .skip(payload?.limit * payload?.index).sort({$natural:-1});
      return new NextResponse(JSON.stringify({ data: data, count: count }), {
        status: 200,
      });
    }
    if (payload?.sort === false) {
      let count = await UsersData.find(
        {
        $or: [
            { designation: {$regex : payload?.search} },
            { name: {$regex :payload?.search} },
            { email: {$regex :payload?.search} },
            { role: {$regex :payload?.search} },
            { department: {$regex :payload?.search} },
            { gender: {$regex :payload?.search} },
            { userType : {$regex :payload?.search} },
            { status : {$regex :payload?.search} }
         ]
        }        
      )
        .then((e) => {
          if (e > 10) {
            return e / payload?.limit;
          } else {
            return 0;
          }
        });
      const data = await UsersData.find(
        {
            $or: [
                { designation: {$regex : payload?.search} },
                { name: {$regex :payload?.search} },
                { email: {$regex :payload?.search} },
                { role: {$regex :payload?.search} },
                { department: {$regex :payload?.search} },
                { gender: {$regex :payload?.search} },
                { userType : {$regex :payload?.search} },
                { status : {$regex :payload?.search} }
             ]
            } 
      )
        .limit(payload?.limit)
        .skip(payload?.limit * payload?.index).sort({$natural:-1});
      return new NextResponse(JSON.stringify({ data: data, count: count }), {
        status: 200,
      });
    }
  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
