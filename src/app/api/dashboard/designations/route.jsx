import connect from "@/app/libs/mongo";
import Designation from "@/model/Designation";
import userData from "@/model/userData";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    const designation = new Designation({ ...payload });
    const result = await designation.save();
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};

export const GET = async (request) => {
  try {
    await connect();
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    if (key) {
      const apiKey = key.replace("f6bb694916a535eecf64c585d4d879ad_", "");
      const user = await userData.findOne({ _id: apiKey });
      if (user) {
        const departments = await Designation.find().sort({ "name": 1 });
        return new NextResponse(JSON.stringify(departments), { status: 200 });
      } else {
        return new NextResponse(JSON.stringify({ error: "Invalid api key." }), {
          status: 200,
        });
      }
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Please add a API key." }),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};

export const PUT = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.email) {
      const updateData = await userData.updateOne(
        { email: payload?.email },
        { designation: payload?.designation }
      );
      if (updateData?.modifiedCount > 0) {
        return new NextResponse(
          JSON.stringify({ status: 200, email: payload?.email }),
          {
            status: 200,
          }
        );
      }
    }
    if (payload?.prevName) {
      const updateData = await userData.updateMany(
        { designation: payload?.prevName },
        { designation: payload?.name }
      );
      const departments = await Designation.updateOne(
        { name: payload?.prevName },
        { name: payload?.name }
      );
      if (updateData?.modifiedCount > 0) {
        return new NextResponse(
          JSON.stringify({
            status: 200,
            designation: payload?.designation,
            allusers: true,
          }),
          {
            status: 200,
          }
        );
      } else {
        if (departments?.modifiedCount > 0) {
          return new NextResponse(
            JSON.stringify({ status: 200, designation: payload?.designation }),
            {
              status: 200,
            }
          );
        }
      }
    }
  } catch (error) {
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};

export const DELETE = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    const updateData = await userData.updateMany(
        { designation: payload?.name },
        { designation: payload?.designation }
      );
      const departments = await Designation.deleteOne(
        { name: payload?.name }
      );
      if (departments?.deletedCount > 0) {
        return new NextResponse(
          JSON.stringify({ status: 200, deleted: true }),
          {
            status: 200,
          }
        );
      }
  } catch (error) {
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
