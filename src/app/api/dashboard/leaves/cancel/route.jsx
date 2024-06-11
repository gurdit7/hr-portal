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
    await Leaves.updateOne({ _id: payload.id }, { status: payload.status });
    const updateUserFields = {};

    if (payload.type === "paidLeaves") {
      updateUserFields.totalLeaveTaken = payload.totalLeaveTaken;
      updateUserFields.balancedLeaves = payload.balancedLeaves;
      updateUserFields.balancedSandwichLeaves = payload.balancedSandwichLeaves;
      updateUserFields.balancedSandwichLeavesTaken =
        payload.balancedSandwichLeavesTaken;
    } else if (payload.type === "unpaidLeaves") {
      updateUserFields.totalUnpaidLeaveTaken = payload.totalUnpaidLeaveTaken;
    }

    if (payload.sandwitchLeave) {
      updateUserFields.balancedSandwichLeaves = payload.balancedSandwichLeaves;
      updateUserFields.balancedSandwichLeavesTaken =
        payload.balancedSandwichLeavesTaken;
      if (
        payload.type === "notUnPaidSandwichLeaves" ||
        payload.type === "paidSandwichLeaves"
      ) {
        updateUserFields.unpaidSandwichLeavesTaken =
          payload.unpaidSandwichLeavesTaken > 0
            ? payload.unpaidSandwichLeavesTaken
            : 0;
      }
      if (
        payload.type === "notPaidSandwichLeaves" ||
        payload.type === "paidSandwichLeaves" ||
        payload.type === "unpaidLeavesSandwich"
      ) {
        updateUserFields.totalUnpaidLeaveTaken =
          payload.totalUnpaidLeaveTaken > 0 ? payload.totalUnpaidLeaveTaken : 0;
      }
      if (payload.type === "unpaid") {
        updateUserFields.unpaidSandwichLeavesTaken =
          payload.unpaidSandwichLeavesTaken;
      }
    }

    await UsersData.updateOne({ email: payload.email }, updateUserFields);
    const updatedUser = await UsersData.findOne({ email: payload.email });

    await sendEmail(
      payload.email,
      `HR Portal - Your Leave is canceled.`,
      `Your Leave is canceled.`
    );

    const notifications = new Notifications({
      ...payload,
      subject: "Your Leave is Canceled.",
      name: "HR",
      toEmails: payload.email,
      type: "info",
      id: payload.id,
      viewed: [{ mail: payload.email, status: false }],
    });

    await notifications.save();

    const updatedLeave = await Leaves.findOne({ _id: payload.id });
    return new NextResponse(
      JSON.stringify({ leave: updatedLeave, user: updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
