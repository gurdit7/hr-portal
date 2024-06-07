import { NextResponse } from "next/server";
import connect from "../../../libs/mongo/index";
import Leaves from "@/model/addLeave";
import UsersData from "@/model/userData";
import Notifications from "@/model/notifications";
import addRole from "@/model/addRole";
import sendEmail from "@/app/mailer/mailer";
import userData from "@/model/userData";

export const getUserByEmail = async (email) => {
  const user = await UsersData.findOne({ email });
  if (!user) throw new Error("User Not Found");
  return user;
};

export const getRolesWithPermission = async (permission) => {
  const roles = await addRole.find({ permissions: permission });
  return roles.map((role) => role.role);
};

export const getEmailsByRoleAndDepartment = async (roles, department) => {
  const users = await UsersData.find({ department, role: { $in: roles } });
  return users.map((user) => user.email);
};

export const getHrAndAdminEmails = async () => {
  const users = await UsersData.find({ role: { $in: ["hr", "admin"] } });
  return users.map((user) => user.email);
};

export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    const leaves = new Leaves({ ...payload, status: "pending" });
    const result = await leaves.save();
    const user = await getUserByEmail(result.email);
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
      `HR Portal - ${user.name} has applied for leave.`,
      `<h4><strong>Subject:</strong> ${payload.subject}</h4>
      <p style="text-align:left;font-size:16px;"><strong>Duration:</strong> ${
        payload.duration === "Other"
          ? `From: ${payload.from} - To: ${payload.to}`
          : payload.duration
      }</p>
      <p style="text-align:left;font-size:16px;"><strong>Date:</strong> ${
        payload.durationDate
      }</p>
      <strong>Description:</strong> ${payload.description}`,
      payload.attachment
    );

    const viewedStatus = mails.map((mail) => ({ mail, status: false }));
    const notifications = new Notifications({
      ...payload,
      toEmails: mails,
      type: "leaves",
      id: result._id,
      viewed: viewedStatus,
    });

    await notifications.save();
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
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
    const key = url.searchParams.get("key");
    if(key){
    const apiKey = key.replace("f6bb694916a535eecf64c585d4d879ad_","");
    const user = await userData.findOne({_id:apiKey});
 
    if(user){
    if (all === "true" && !value) {
      const leaves = await Leaves.find().sort({ $natural: -1 });
      return new NextResponse(JSON.stringify(leaves), { status: 200 });
    }
    if (all === "true" && value) {
      const leaves = await Leaves.find({ status: value }).sort({
        $natural: -1,
      });
      return new NextResponse(JSON.stringify(leaves), { status: 200 });
    }
    if (all === "salary") {
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const leaves = await Leaves.find({
        createdAt: { $gte: firstDay, $lt: lastDay },
      }).sort({
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
      const leaves = await Leaves.find({ email }).sort({ $natural: -1 });
      const user = await UsersData.findOne({ email });
      return new NextResponse(JSON.stringify({ leaves, user }), {
        status: 200,
      });
    }
    if (email && value) {
      const leaves = await Leaves.find({ email, status: value }).sort({
        $natural: -1,
      });
      const user = await UsersData.findOne({ email });
      return new NextResponse(JSON.stringify({ leaves, user }), {
        status: 200,
      });
    }
    if (id) {
      const leaves = await Leaves.findById(id);
      const user = await UsersData.findOne({ email: leaves.email }).sort({
        $natural: -1,
      });
      return new NextResponse(JSON.stringify({ leaves, user }), {
        status: 200,
      });
    } 
  }  
  else{
    return new NextResponse(JSON.stringify({ error:"Invalid api key." }), {
      status: 200,
    });
  }
}
else{
  return new NextResponse(JSON.stringify({ error:"Please add a API key." }), {
    status: 200,
  });
}
  console.log("apiKey",apiKey)
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};

export const PUT = async (request) => {
  try {
    await connect();
    const payload = await request.json();

    if (payload.update === "leaves") {
      await UsersData.updateOne(
        { email: payload.email },
        {
          totalLeaveTaken: payload.totalLeaveTaken,
          balancedLeaves: payload.balancedLeaves,
          balancedSandwichLeaves: payload.balancedSandwichLeaves,
          balancedSandwichLeavesTaken: payload.balancedSandwichLeavesTaken,
        }
      );
      const updatedUser = await UsersData.findOne({ email: payload.email });
      return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
    }

    if (payload.update === "cancel") {
      await Leaves.updateOne({ _id: payload.id }, { status: payload.status });
      await UsersData.updateOne(
        { email: payload.email },
        {
          totalLeaveTaken: payload.totalLeaveTaken,
          balancedLeaves: payload.balancedLeaves,
          balancedSandwichLeaves: payload.balancedSandwichLeaves,
          balancedSandwichLeavesTaken: payload.balancedSandwichLeavesTaken,
        }
      );
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
      return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
    }
    if(payload.update === "approve"){
    
    await Leaves.updateOne(
      { _id: payload.id },
      { status: payload.status, reason: payload.reason }
    );
    const updatedLeave = await Leaves.findById(payload.id);
    await sendEmail(
      payload.email,
      `HR Portal - Your leave is ${payload.status}`,
      `
      ${payload.reason}
      `
    );
    const notifications = new Notifications({
      ...payload,
      subject: `Your leave is ${payload.status}`,
      description: `${payload.reason}`,
      name: "HR",
      toEmails: payload.email,
      type: "info",
      id: payload.id,
      viewed: [{ mail: payload.email, status: false }],
    });

    await notifications.save();
    const updatedUser = await UsersData.updateOne(
      { email: payload.email },
      {
        totalLeaveTaken: payload.totalLeaveTaken,
        balancedLeaves: payload.balancedLeaves,
        balancedSandwichLeaves: payload.balancedSandwichLeaves,
        balancedSandwichLeavesTaken: payload.balancedSandwichLeavesTaken,
      }
    );
  }
    return new NextResponse(
      JSON.stringify({ leave: updatedLeave, user: updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
