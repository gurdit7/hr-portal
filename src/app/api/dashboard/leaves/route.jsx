import { NextResponse } from "next/server";
import connect from "../../../libs/mongo/index";
import Leaves from "@/model/addLeave";
import UsersData from "@/model/userData";
import Notifications from "@/model/notifications";
import addRole from "@/model/addRole";
import sendEmail from "@/app/mailer/mailer";

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
export const getEmailsByRole = async (roles) => {
  const users = await UsersData.find({ role: { $in: roles } });
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
    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const user = await getUserByEmail(payload?.email);
    const balancedLeaves = user?.balancedLeaves - thisMonth;
    const paidOrnot = balancedLeaves - payload?.durationHours / 8;
    const totalLeaves = payload?.durationHours / 8;
    if (payload.sandwitchLeave === false) {
      if (totalLeaves > balancedLeaves) {
        payload.paidLeaves = balancedLeaves;
        payload.unPaidLeaves = totalLeaves - balancedLeaves;
      } else {
        if (paidOrnot >= 0 && balancedLeaves) {
          payload.paidLeaves = paidOrnot > 0 ? paidOrnot : 1;
        } else {
          payload.unPaidLeaves = payload?.durationHours / 8;
        }
      }
    }
    const leaves = new Leaves({ ...payload, status: "pending" });
    const result = await leaves.save();

    const roles = await getRolesWithPermission("view-users-notifications");
    const departmentEmails = await getEmailsByRoleAndDepartment(
      roles,
      user.department
    );
    const hrAdminEmails = await getHrAndAdminEmails();
    const mails = [...new Set([...departmentEmails, ...hrAdminEmails])];
    const filterdMails = mails.filter((item)=>(item != payload?.email));
    const mailsString = filterdMails.toString();
    console.log(mailsString, filterdMails);
    
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
      type: "leaveRequest",
      id: result._id,
      link:`/dashboard/leaves/${result._id}`,
      viewed: viewedStatus,
    });

    await notifications.save();
    return new NextResponse(JSON.stringify({result, mails}), { status: 200 });
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
    if (key) {
      const user = await UsersData.findOne({ _id: key, status:'active' });
      if (user) {
        const result = await addRole.findOne({
          role: user.role,
          $or: [{ permissions: "read-leaves" }, { permissions: "user-leaves" }],
        });
        if (result) {
          if (all === "true" && !value) {
            const rolesUsers = await getRolesWithPermission("user-leaves");
            const rolesTeam = await getRolesWithPermission("view-team-leaves");
            if(rolesUsers.includes(user.role)){
            const leaves = await Leaves.find().sort({ $natural: -1 });
            return new NextResponse(JSON.stringify(leaves), { status: 200 });
            }
            if(rolesTeam.includes(user.role)){
              const users = await UsersData.find({ department: user?.department });
              const mails = users.map((user) => user.email);             
              const leaves = await Leaves.find({ email: { $in: mails } });   
              return new NextResponse(JSON.stringify(leaves), { status: 200 });
            }
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
            const lastDay = new Date(
              date.getFullYear(),
              date.getMonth() + 1,
              0
            );
            const leaves = await Leaves.find({
              $or: [{ status: "approved" }, { status: "updated" }],
              createdAt: { $gte: firstDay, $lt: lastDay },
            }).sort({
              $natural: -1,
            });
            return new NextResponse(JSON.stringify(leaves), { status: 200 });
          }
          if (!id && !email && !all) {
            return new NextResponse(
              JSON.stringify({ error: "Email not provided" }),
              {
                status: 400,
              }
            );
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
        } else {
          return new NextResponse(
            JSON.stringify({
              error: "You don't have permissions to get the data.",
            }),
            { status: 403 }
          );
        }
      } else {
        return new NextResponse(JSON.stringify({ error: "Invalid api key." }), {
          status: 200,
        });
      }
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Please add a API key." }),
        {
          status: 200,
        }
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

export const PUT = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) {   
      const user = await UsersData.findOne({ _id: payload?.key, status:'active' });
      if (user) {        
        const result = await addRole.findOne({
          role: user.role,
          permissions: "approve-decline-leaves"
        });
        if (result) {
          let updatedLeave,
            updatedUser = 0;
          const user = await UsersData.findOne({ email: payload?.email });
          if (payload.update === "leaves") {
            updatedLeave = await Leaves.updateOne(
              { _id: payload.id },
              { status: "updated", reason: payload.reason }
            );
            await UsersData.updateOne(
              { email: payload.email },
              {
                totalLeaveTaken: payload.totalLeaveTaken,
                balancedLeaves: payload.balancedLeaves,
                balancedSandwichLeaves: payload.balancedSandwichLeaves,
                balancedSandwichLeavesTaken:
                  payload.balancedSandwichLeavesTaken || 0,
                totalUnpaidLeaveTaken: payload.totalUnpaidLeaveTaken || 0,
                unpaidSandwichLeavesTaken:
                  payload.unpaidSandwichLeavesTaken || 0,
              }
            );
            updatedUser = await UsersData.findOne({ email: payload.email });
            const mails = [];
            mails.push(payload.email);
        
            await sendEmail(
              payload.email,
              `HR Portal - Your leaves is updated.`,
              `Please check HR portal your leave is updated.`,
              payload.attachment
            );
        
            const viewedStatus = mails.map((mail) => ({ mail, status: false }));
            const notifications = new Notifications({
              ...payload,
              toEmails: mails,
              type: "leaveUpdated",
              id: result._id,
              link:`/dashboard/leaves/${result._id}`,
              viewed: viewedStatus,
            });
        
            await notifications.save();
            return new NextResponse(
              JSON.stringify({ leave: updatedLeave, user: User, mails }),
              { status: 200 }
            );
          }
      
        }
        else {
          return new NextResponse(
            JSON.stringify({
              error: "You don't have permissions.",
            }),
            { status: 403 }
          );
        }
      }
      else {
        return new NextResponse(
          JSON.stringify({
            error: "Invalid API key.",
          }),
          { status: 403 }
        );
      }
    }
    else {
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
