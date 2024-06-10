import connect from "@/app/libs/mongo";
import userData from "@/model/userData";
import { NextResponse } from "next/server";
import { getEmailsByRole, getRolesWithPermission } from "../route";
import notifications from "@/model/notifications";
import sendEmail from "@/app/mailer/mailer";

export const PUT = async (request) => {
  try {
    await connect();
    const date = new Date();
    const month = date.getMonth() + 1;
    const allUsers = await userData.find();
    let balancedSandwichLeaves = 4;
    if (month === 4) {
      balancedSandwichLeaves = 3;
    } else if (month === 7) {
      balancedSandwichLeaves = 2;
    } else if (month === 10) {
      balancedSandwichLeaves = 1;
    }
    const theArray = allUsers.map(async (item) => {
      await userData.updateOne(
        { _id: item.id },
        { balancedSandwichLeaves: balancedSandwichLeaves }
      );
      if (month === 1) {
        await userData.updateOne(
          { _id: item.id },
          { balancedSandwichLeavesTaken: balancedSandwichLeavesTaken }
        );
      }
    });
    const roles = await getRolesWithPermission(
        "sandwich-leaves-update-cron-notifications"
      );
      const mails = await getEmailsByRole(roles);
      const mailsString = mails.toString();   
      const viewedStatus = mails.map((mail) => ({ mail, status: false }));
      await sendEmail(
        mailsString,
        `Balanced Sandwich Leaves are update for all users.`,
        "Balanced Sandwich Leaves are update for all users.  Please check on the HR portal."
      );
      const notification = new notifications({
        email: "uianduxdesigner757@gmail.com",
        subject: `Balanced Sandwich Leaves are update for all users.`,
        description: `Balanced Sandwich Leaves are update for all users. Please check on the HR portal.`,
        name: "HR",
        toEmails: mailsString,
        type: "cron",
        viewed: viewedStatus,
      });

      await notification.save();
    return new NextResponse(JSON.stringify({ theArray }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
