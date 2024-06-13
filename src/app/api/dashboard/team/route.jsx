import { NextResponse } from "next/server";
import userData from "@/model/userData";
import Roles from "@/model/addRole";
import connect from "@/app/libs/mongo";

export const GET = async (request) => {
  try {
    await connect();
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const start = url.searchParams.get("st");
    const limit = url.searchParams.get("lt");
    if (key) {
      const apiKey = key.replace("f6bb694916a535eecf64c585d4d879ad_", "");
      const user = await userData.findOne({ _id: apiKey });

      if (user) {
        const result = await Roles.findOne({
          role: user.role,
          permissions: "read-team",
        });
        if (result) {
          const members = await userData
            .find({
              department: user?.department,
              status: "active",
              designation: { $not: { $regex: user?.designation } },
            })
            .sort({ $natural: -1 });

          const allMembers = members.map(
            ({
              userType,
              email,
              name,
              joinDate,
              designation,
              gender,
              department,
              DOB,
              incrementDate,
            }) => ({
              userType,
              email,
              name,
              joinDate,
              designation,
              gender,
              department,
              DOB,
              incrementDate,
            })
          );
          return new NextResponse(JSON.stringify({ members: allMembers }), {
            status: 200,
          });
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
    return new NextResponse(
      JSON.stringify({
        error: "Invalid API key.",
      }),
      { status: 403 }
    );
  }
};
