import connect from "@/app/libs/mongo";
import Roles from "@/model/addRole";
import userData from "@/model/userData";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request) => {
  try {
    const db = await connect();
    const payload = await request.json();
    if (payload?.key) {
      const user = await userData?.findOne({ _id: payload?.key, status: "active" });
      const data = await Roles.find({
        role: user?.role,
        permissions: "write-roles",
      });
      if (data && data.length > 0) {
        const prevRoles = await Roles.find({ role: payload?.name });
        if (prevRoles && prevRoles.length === 0) {
          const newRole = new Roles({
            role: payload?.name,
            permissions: payload?.permissions,
          });
          await newRole.save();
          return new NextResponse(JSON.stringify({ success: true }), {
            status: 200,
          });
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

export const GET = async (request) => {
  try {
    await connect();
    const role = await Roles.find();
    const allRoles = role.map((items) => {
      return items.role;
    });
    return new NextResponse(JSON.stringify({ role: allRoles }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      "ERROR" +
        JSON.stringify({
          error: "Please add required fields.",
          errors: JSON.stringify(error),
        }),
      { status: 500 }
    );
  }
};

export const PUT = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) { 
      const user = await userData?.findOne({ _id: payload?.key, status: "active" });
      const data = await Roles.find({
        role: user?.role,
        permissions: "write-roles",
      });
      if (data && data.length > 0) {
        if (payload?.email) {
          const updateData = await userData?.updateOne(
            { email: payload?.email },
            { role: payload?.role }
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
        if (payload?.newPermissions) {
          const check = await Roles.updateOne(
            { role: payload?.name },
            { permissions: payload?.newPermissions }
          );
          return new NextResponse(
            JSON.stringify({
              status: 200,
              newPermissions: true,
            }),
            {
              status: 200,
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

export const DELETE = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) {  
      const user = await userData?.findOne({ _id: payload?.key, status: "active" });
      const data = await Roles.find({
        role: user?.role,
        permissions: "write-roles",
      });
      if (data && data.length > 0) {
        const updateData = await userData?.updateMany(
          { role: payload?.name },
          { role: payload?.role }
        );
        const departments = await Roles.deleteOne({ role: payload?.name });
        if (departments?.deletedCount > 0) {
          return new NextResponse(
            JSON.stringify({ status: 200, deleted: true }),
            {
              status: 200,
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
