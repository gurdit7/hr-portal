import connect from "@/app/libs/mongo";
import sendEmail from "@/app/mailer/mailer";
import Leaves from "@/model/addLeave";
import Notifications from "@/model/notifications";
import UsersData from "@/model/userData";
import { NextResponse } from "next/server";

export const PUT = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    await Leaves.updateOne({ _id: payload.id }, { status: payload.status,  reason: payload.reason });
    
    await sendEmail(
      payload.email,
      `HR Portal - Your Leave is decline.`,
      `Your Leave is decline.`
    );

    const notifications = new Notifications({
      ...payload,
      subject: "Your Leave is decline.",
      name: "HR",
      toEmails: payload.email,
      type: "info",
      id: payload.id,
      viewed: [{ mail: payload.email, status: false }],
    });

    await notifications.save();
    const User = await UsersData.findOne({ email: payload.email });
    const updatedLeave = await Leaves.findOne({ _id: payload.id });
    const mails = [];
    mails.push(payload.email);
    return new NextResponse(
      JSON.stringify({ leave: updatedLeave, user: User, mails }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
