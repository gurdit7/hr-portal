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
    const allUsers = await userData?.find();
      const theArray = allUsers.map(async (item) => {
      await userData?.updateOne(
        { _id: item.id },
        { balancedLeaves: 12, totalLeaveTaken: 0 }
      );
    });
    const roles = await getRolesWithPermission(
        "sandwich-leaves-update-cron-notifications"
      );
      const mails = await getEmailsByRole(roles);
      const mailsString = mails.toString();   
      const viewedStatus = mails.map((mail) => ({ mail, status: false }));
      await sendEmail(
        mailsString,
        `Balanced Leaves are update for all users.`,
        "Balanced Leaves are update for all users.  Please check on the HR portal."
      );
      const notification = new notifications({
        email: "uianduxdesigner757@gmail.com",
        subject: `Balanced Leaves are update for all users.`,
        description: `Balanced Leaves are update for all users. Please check on the HR portal.`,
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
