import connect from "@/app/libs/mongo";
import Department from "@/model/Department";
import userData from "@/model/userData";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    const Departments = new Department({ ...payload });
    const result = await Departments.save();
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
      const user = await userData?.findOne({ _id: key, status:'active' });
      if (user) {
        const departments = await Department.find().sort({ "name": 1  });
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
      const updateData = await userData?.updateOne(
        { email: payload?.email },
        { department: payload?.department }
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
      const updateData = await userData?.updateMany(
        { department: payload?.prevName },
        { department: payload?.name }
      );
      const departments = await Department.updateOne(
        { name: payload?.prevName },
        { name: payload?.name }
      );
      if (updateData?.modifiedCount > 0) {
        return new NextResponse(
          JSON.stringify({
            status: 200,
            department: payload?.department,
            allusers: true,
          }),
          {
            status: 200,
          }
        );
      } else {
        if (departments?.modifiedCount > 0) {
          return new NextResponse(
            JSON.stringify({ status: 200, department: payload?.department }),
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
    const updateData = await userData?.updateMany(
        { department: payload?.name },
        { department: payload?.department }
      );
      const departments = await Department.deleteOne(
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
