import connect from "@/app/libs/mongo";
import sendEmail from "@/app/mailer/mailer";
import Leaves from "@/model/addLeave";
import addRole from "@/model/addRole";
import Notifications from "@/model/notifications";
import UsersData from "@/model/userData";
import { NextResponse } from "next/server";

export const PUT = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) {
      const user = await UsersData.findOne({ _id: payload?.key, status:'active' });
      if (user) { 
        const result = await addRole.findOne({
          role: user.role,
          permissions: "approve-decline-leaves",
        });
        if (result) {
          await Leaves.updateOne(
            { _id: payload.id },
            { status: payload.status, reason: payload.reason }
          );

          const updatedLeave = await Leaves.findById(payload.id);

          await sendEmail(
            payload.email,
            `HR Portal - Your leave is ${payload.status}`,
            `${payload.reason}`
          );

          const notifications = new Notifications({
            ...payload,
            subject: `Your leave is ${payload.status}`,
            description: `${payload.reason}`,
            name: "HR",
            toEmails: payload.email,
            type: "info",
            id: payload.id,
            link:`/dashboard/leaves/${result._id}`,
            viewed: [{ mail: payload.email, status: false }],
          });
          await notifications.save();

          const updateUserFields = {};

          if (payload.totalUnpaidLeaveTaken) {
            updateUserFields.totalUnpaidLeaveTaken =
              (user?.totalUnpaidLeaveTaken || 0) +
              payload.totalUnpaidLeaveTaken;
          }
          if (payload.totalLeaveTaken) {
            updateUserFields.totalLeaveTaken = payload.totalLeaveTaken;
          }
          if (payload.balancedLeaves) {
            updateUserFields.balancedLeaves = payload.balancedLeaves;
          }
          if (payload.balancedSandwichLeaves) {
            updateUserFields.balancedSandwichLeaves =
              payload.balancedSandwichLeaves;
          }
          if (payload.balancedSandwichLeavesTaken) {
            updateUserFields.balancedSandwichLeavesTaken =
              (user?.balancedSandwichLeavesTaken || 0) +
              payload.balancedSandwichLeavesTaken;
          }
          if (payload.unpaidSandwichLeavesTaken) {
            updateUserFields.unpaidSandwichLeavesTaken =
              (user?.unpaidSandwichLeavesTaken || 0) +
              payload.unpaidSandwichLeavesTaken;
          }

          if (payload.sandwitchLeave) {
            switch (payload.sandwitchLeaveType) {
              case "both":
              case "paidLeaveBoth":
                updateUserFields.balancedSandwichLeaves -=
                  payload.balancedSandwichLeavesTaken;
                updateUserFields.balancedSandwichLeavesTaken +=
                  payload.balancedSandwichLeavesTaken;
                updateUserFields.unpaidSandwichLeavesTaken +=
                  payload.unpaidSandwichLeavesTaken;
                if (payload.sandwitchLeaveType === "paidLeaveBoth") {
                  updateUserFields.totalUnpaidLeaveTaken +=
                    payload.totalUnpaidLeaveTaken;
                }
                break;
              case "paid&Leave":
                updateUserFields.balancedSandwichLeaves -=
                  payload.balancedSandwichLeavesTaken;
                updateUserFields.balancedSandwichLeavesTaken +=
                  payload.balancedSandwichLeavesTaken;
                updateUserFields.totalUnpaidLeaveTaken +=
                  payload.totalUnpaidLeaveTaken;
                break;
              case "unpaidLeave":
                updateUserFields.totalUnpaidLeaveTaken +=
                  payload.totalUnpaidLeaveTaken;
                updateUserFields.unpaidSandwichLeavesTaken +=
                  payload.unpaidSandwichLeavesTaken;
                break;
              case "paid":
                updateUserFields.balancedSandwichLeaves -=
                  payload.balancedSandwichLeavesTaken;
                updateUserFields.balancedSandwichLeavesTaken +=
                  payload.balancedSandwichLeavesTaken;
                break;
              case "unpaid":
                updateUserFields.unpaidSandwichLeavesTaken +=
                  payload.unpaidSandwichLeavesTaken;
                break;
              default:
                break;
            }
          }

          await UsersData.updateOne({ email: payload.email }, updateUserFields);
          const User = await UsersData.findOne({ email: payload.email });
          return new NextResponse(
            JSON.stringify({ leave: updatedLeave, user: User, mails:payload.email }),
            { status: 200 }
          );
        } else {
          return new NextResponse(
            JSON.stringify({
              error: "You don't have permissions.",
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
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        error: "Invalid API key.",
      }),
      { status: 403 }
    );
  }
};
