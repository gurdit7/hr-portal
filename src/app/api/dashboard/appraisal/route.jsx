import connect from "@/app/libs/mongo";
import AppraisalForm from "@/model/AppraisalForm";
import { NextResponse } from "next/server";
import { getEmailsByRoleAndDepartment, getHrAndAdminEmails, getRolesWithPermission, getUserByEmail } from "../leaves/route";
import sendEmail from "@/app/mailer/mailer";
import Notifications from "@/model/notifications";
import UsersData from "@/model/userData";

export const POST = async (request) => {
  try {
    const db =  await connect();
    const payload = await request.json();    
    const appraisal = new AppraisalForm({
      email: payload?.email,
      userID: payload?.userID,
      ExpectedSalary: payload?.ExpectedSalary,
      description: payload?.description,   
      currentSalary: payload?.currentSalary,      
      name: payload?.name,
      status: 'pending',
      file: ''
    });
    const user = await getUserByEmail(payload?.email);
    const roles = await getRolesWithPermission("view-users-notifications");
    const departmentEmails = await getEmailsByRoleAndDepartment(
      roles,
      user.department
    );
    const hrAdminEmails = await getHrAndAdminEmails();
    const mails = [...new Set([...departmentEmails, ...hrAdminEmails])];
    const mailsString = mails.toString();

    await sendEmail(
      mailsString,
      `HR Portal - ${user.name} has requested for appraisal.`,
      `<h4><strong>Expected Salary: </strong> ${payload.ExpectedSalary}</h4>    
      <strong>Description:</strong> ${payload.description}`
    );

    const viewedStatus = mails.map((mail) => ({ mail, status: false }));
    const result = await appraisal.save();
    const notification = new Notifications({
      ...payload,
      toEmails: mails,
      subject: `${user.name} has requested for appraisal.`,
      type: "appraisalForm",
      id: result._id,
      viewed: viewedStatus,
    });
    await notification.save();   
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};

export const GET = async (request) => {
  try {
    await connect();
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const id = url.searchParams.get("id");
    const all = url.searchParams.get("all");
    const value = url.searchParams.get("value");

    if (all === "true" && !value) {
      const leaves = await AppraisalForm.find().sort({ $natural: -1 });
      return new NextResponse(JSON.stringify(leaves), { status: 200 });
    }
    if (all === "true" && value) {
      const leaves = await AppraisalForm.find({ status: value }).sort({
        $natural: -1,
      });
      return new NextResponse(JSON.stringify(leaves), { status: 200 });
    }
    if (!id && !email) {
      return new NextResponse(JSON.stringify({ error: "Email not provided" }), {
        status: 400,
      });
    }

    if (email && !value) {
      const leaves = await AppraisalForm.find({ email }).sort({ $natural: -1 });
      const user = await UsersData.findOne({ email });
      return new NextResponse(JSON.stringify({ leaves, user }), {
        status: 200,
      });
    }
    if (email && value) {
      const leaves = await AppraisalForm.find({ email, status: value }).sort({
        $natural: -1,
      });
      const user = await UsersData.findOne({ email });
      return new NextResponse(JSON.stringify({ leaves, user }), {
        status: 200,
      });
    }

    if (id) {
      const leaves = await AppraisalForm.findById(id);
      const user = await UsersData.findOne({ email: leaves.email }).sort({
        $natural: -1,
      });
      return new NextResponse(JSON.stringify({ leaves, user }), {
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};



export const PUT = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    await AppraisalForm.updateOne(
      { _id: payload.id },
      { status: payload.status, reason: payload.reason, salaryOffered:payload?.salaryOffered }
    );
    const updatedLeave = await AppraisalForm.findById(payload.id);
    await sendEmail(
      payload.email,
      `HR Portal - Your appraisal is ${payload.status}`,
      `${payload.reason}`
    );
    const notifications = new Notifications({
      email:payload.email,
      subject: `Your appraisal is ${payload.status}`,
      description: `${payload.reason}`,
      name: "HR",
      toEmails: payload.email,
      type: "appraisalForm",
      id: payload.id,
      viewed: [{ mail: payload.email, status: false }],
    });
    const user = await UsersData.updateOne({email:payload.email},{currentSalary:payload?.salaryOffered});
    await notifications.save();
    return new NextResponse(
      JSON.stringify({ leave: updatedLeave }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
