import { NextResponse, NextRequest } from "next/server";
import connect from "../../../libs/mongo/index";
import Notifications from "@/model/notifications";
import userData from "@/model/userData";
import Roles from "@/model/addRole";

export const GET = async (request) => {
  try {
    await connect();
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const email = url.searchParams.get("email");
    if (key) {
      const user = await userData.findOne({ _id: key, status:'active' });
      if (user) {
        const result = await Roles.findOne({
          role: user.role,
          permissions: "view-users-notifications",
        });
        if (result) {
          const data = await Notifications.find({ toEmails: email })
            .sort({ $natural: -1 })
            .then((res) => {
              if (res) {
                return res;
              }
            })
            .then((res) => {
              return res;
            });
          const result = data.map((item) => {
            const viewedStatus = item?.viewed.find(mail => mail?.mail === email)?.status;
            return { name: item.name, createdDate: item.createdAt, viewedStatus, type: item.type, id: item.id, mainId: item._id };
          });
          return new NextResponse(JSON.stringify({ data: result }), {
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

export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    const date = new Date();
    const notifications = new Notifications({
      email: payload?.emails,
      subject: payload?.subject,
      attachment: payload?.attachment,
      description: payload?.description,
      name: payload?.name,
      sendDate: payload?.sendDate,
    });
    const result = await notifications.save();
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};

export const PUT = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    const notification = await Notifications.updateOne(
      { _id: payload.id },
      { viewed: payload.viewed }
    );
    return new NextResponse(JSON.stringify(notification), { status: 200 });
  } catch (error) {
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
