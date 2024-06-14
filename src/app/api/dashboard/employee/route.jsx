import { NextResponse, NextRequest } from "next/server";
import connect from "../../../libs/mongo/index";
import UsersData from "../../../../model/userData";
import addRole from "@/model/addRole";
export const GET = async (request) => {
  try {
    await connect();
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    if (key) {
      const user = await UsersData.findOne({ _id: key, status: "active" });
      if (user) {
        const result = await addRole.findOne({
          role: user.role,
          permissions: "read-employees",
        });
        if (result) {
          const leaves = await UsersData.find().sort({ $natural: -1 });
          return new NextResponse(JSON.stringify({ leaves }), { status: 200 });
        } else {
          return new NextResponse(
            JSON.stringify({
              error: "You don't have permissions to get the data.",
            }),
            { status: 403 }
          );
        }
      } else {
        return new NextResponse(
          JSON.stringify({
            error: "Invalid API key.",
          }),
          { status: 403 }
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Please add the API key." }),
        { status: 403 }
      );
    }
  } catch (error) {
    if (error?.path === "_id") {
      return new NextResponse(JSON.stringify({ error: "Invalid api key." }), {
        status: 401,
      });
    } else {
      return new NextResponse(
        "ERROR" +
          JSON.stringify({
            error: "Please add required fields.",
            errors: JSON.stringify(error),
          }),
        { status: 500 }
      );
    }
  }
};

export const PUT = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) {
      const user = await UsersData.findOne({ _id: payload?.key, status: "active" });
      if (user) {
        const result = await addRole.findOne({
          role: user.role,
          permissions: "read-employees",
        });
        if (result) {
          const updateData = await UsersData.updateOne(
            { email: payload?.email },
            {
              name: payload?.name,
              joinDate: payload?.joinDate,
              designation: payload?.designation,
              role: payload?.role,
              gender: payload?.gender,
              department: payload?.department,
              DOB: payload?.DOB,
              incrementDate: payload?.incrementDate,
              currentSalary: payload?.currentSalary,
              status: payload?.status,
              userType: payload?.userType,
              balancedLeaves: payload?.balancedLeaves,
              totalLeaveTaken: payload?.totalLeaveTaken,
              balancedSandwichLeaves: payload?.balancedSandwichLeaves,
              balancedSandwichLeavesTaken: payload?.balancedSandwichLeavesTaken,
            }
          );
          return new NextResponse(JSON.stringify(updateData), { status: 200 });
        } else {
          return new NextResponse(
            JSON.stringify({ error: "Please select a different name." }),
            {
              status: 403,
            }
          );
        }
      } else {
        return new NextResponse(
          JSON.stringify({ error: "You Don't have permissions." }),
          {
            status: 403,
          }
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Please add API key." }),
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    if (error?.path === "_id") {
      return new NextResponse(JSON.stringify({ error: "Invalid api key." }), {
        status: 401,
      });
    } else {
      return new NextResponse(
        JSON.stringify({
          error: "Please add required fields.",
          errors: JSON.stringify(error),
        }),
        { status: 500 }
      );
    }
  }
};

export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) {
      const user = await UsersData.findOne({ _id: payload?.key, status: "active" });
      if (user) {
        const result = await addRole.findOne({
          role: user.role,
          permissions: "write-profile",
        });
        if (result) {
          const userDataPerson = await UsersData.updateOne(
            { email: payload?.email },
            {
              personalEmail: payload?.personalEmail,
              currentAddress: payload?.currentAddress,
              permanentAddress: payload?.permanentAddress,
              phoneNumber: payload?.phoneNumber,
              accountNumber: payload?.accountNumber,
              IFSC: payload?.IFSC,
            }
          );
          const data = await UsersData.findOne({ email: payload?.email }).then(
            async (userExist) => {
              return userExist;
            }
          );
          return new NextResponse(JSON.stringify(data), { status: 200 });
        } 
      else {
        return new NextResponse(
          JSON.stringify({ error: "You Don't have permissions." }),
          {
            status: 403,
          }
        );
      }
    }
    else {
      return new NextResponse(
        JSON.stringify({ error: "Invalid api key." }),
        {
          status: 401,
        }
      );
    }
  }
    else {
      return new NextResponse(
        JSON.stringify({ error: "Please add API key." }),
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    if (error?.path === "_id") {
      return new NextResponse(JSON.stringify({ error: "Invalid api key." }), {
        status: 401,
      });
    } else {
      return new NextResponse(
        JSON.stringify({
          error: "Please add required fields.",
          errors: JSON.stringify(error),
        }),
        { status: 500 }
      );
    }
  }
};
