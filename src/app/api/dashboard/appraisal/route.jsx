import connect from "@/app/libs/mongo";
import AppraisalForm from "@/model/AppraisalForm";
import { NextResponse } from "next/server";
import {
  getEmailsByRoleAndDepartment,
  getHrAndAdminEmails,
  getRolesWithPermission,
  getUserByEmail,
} from "../leaves/route";
import sendEmail from "@/app/mailer/mailer";
import Notifications from "@/model/notifications";
import UsersData from "@/model/userData";
import addRole from "@/model/addRole";

export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) {
      const user = await UsersData.findOne({
        _id: payload?.key,
        status: "active",
      });
      if (user) {
        const result = await addRole.findOne({
          role: user.role,
          permissions: "write-profile",
        });
        if (result) {
          const appraisal = new AppraisalForm({
            email: payload?.email,
            userID: payload?.userID,
            ExpectedSalary: payload?.ExpectedSalary,
            description: payload?.description,
            currentSalary: payload?.currentSalary,
            name: payload?.name,
            status: "pending",
            file: "",
          });
          const user = await getUserByEmail(payload?.email);
          const roles = await getRolesWithPermission(
            "view-users-notifications"
          );
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
            link: `/dashboard/appraisal/${result._id}`,
            viewed: viewedStatus,
          });
          await notification.save();
          return new NextResponse(JSON.stringify({ result, mails }), {
            status: 200,
          });
        } else {
          return new NextResponse(
            JSON.stringify({ error: "You Don't have permissions." }),
            {
              status: 403,
            }
          );
        }
      } else {
        return new NextResponse(JSON.stringify({ error: "Invalid api key." }), {
          status: 401,
        });
      }
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Please add API key." }),
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    if (error?.path === "_id") {
      return new NextResponse(JSON.stringify({ error: "Invalid api key." }), {
        status: 401,
      });
    } else {
      return new NextResponse(
        JSON.stringify({
          error: "Please add required fields.",
          errors: JSON.stringify(error),
        }),
        { status: 500 }
      );
    }
  }
};

export const GET = async (request) => {
  try {
    await connect();
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const id = url.searchParams.get("id");
    const all = url.searchParams.get("all");
    const key = url.searchParams.get("key");
    if (key) {
      const user = await UsersData.findOne({ _id: key, status: "active" });
      if (user) {
        const result = await addRole.findOne({
          role: user.role,
          permissions: "view-appraisal",
        });
        if (result) {
          if (all) {
            const leaves = await AppraisalForm.find().sort({ $natural: -1 });
            return new NextResponse(JSON.stringify(leaves), { status: 200 });
          }
          if (email) {
            const appraisal = await AppraisalForm.find({ email }).sort({
              $natural: -1,
            });
            const user = await UsersData.findOne({ email });
            return new NextResponse(JSON.stringify({ appraisal, user }), {
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

export const PUT = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) {
      const user = await UsersData.findOne({
        _id: payload?.key,
        status: "active",
      });
      if (user) {
        const result = await addRole.findOne({
          role: user.role,
          permissions: "write-appraisal",
        });
        if (result) {
          await AppraisalForm.updateOne(
            { _id: payload.id },
            {
              status: payload.status,
              reason: payload.reason,
              salaryOffered: payload?.salaryOffered,
            }
          );
          const updatedLeave = await AppraisalForm.findById(payload.id);
          await sendEmail(
            payload.email,
            `HR Portal - Your appraisal is ${payload.status}`,
            `${payload.reason}`
          );
          let subject = "Your appraisal is decline.";
          if (payload.status === "approved") {
            subject = "Your appraisal is approved.";
          }

          const notifications = new Notifications({
            email: payload.email,
            subject: subject,
            description: `${payload.reason}`,
            name: "HR",
            toEmails: payload.email,
            type: "info",
            id: payload.id,
            viewed: [{ mail: payload.email, status: false }],
          });
          const user = await UsersData.updateOne(
            { email: payload.email },
            { currentSalary: payload?.salaryOffered }
          );
          await notifications.save();
          return new NextResponse(JSON.stringify({ leave: updatedLeave, mails:payload.email, subject:subject, reason:payload.reason  }), {
            status: 200,
          });
        } else {
          return new NextResponse(
            JSON.stringify({ error: "Please select a different name." }),
            {
              status: 403,
            }
          );
        }
      } else {
        return new NextResponse(
          JSON.stringify({ error: "You Don't have permissions." }),
          {
            status: 403,
          }
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Please add API key." }),
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    if (error?.path === "_id") {
      return new NextResponse(JSON.stringify({ error: "Invalid api key." }), {
        status: 401,
      });
    } else {
      return new NextResponse(
        JSON.stringify({
          error: "Please add required fields.",
          errors: JSON.stringify(error),
        }),
        { status: 500 }
      );
    }
  }
};
