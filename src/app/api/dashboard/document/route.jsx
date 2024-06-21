import connect from "@/app/libs/mongo";
import addRole from "@/model/addRole";
import notifications from "@/model/notifications";
import requestDocuments from "@/model/requestDocuments";
import userData from "@/model/userData";
import { NextResponse, NextRequest } from "next/server";
import {
  getEmailsByRoleAndDepartment,
  getHrAndAdminEmails,
  getRolesWithPermission,
  getUserByEmail,
} from "../leaves/route";
import sendEmail from "@/app/mailer/mailer";

export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) {
      const user = await userData.findOne({
        _id: payload?.key,
        status: "active",
      });
      if (user) {
        const result = await addRole.findOne({
          role: user.role,
          permissions: "apply-documents",
        });
        if (result) {
          const user = await getUserByEmail(payload?.email);
          const documentPOST = new requestDocuments({
            email: payload?.email,
            userID: payload?.userID,
            document: payload?.document,
            description: payload?.description,
            name: payload?.name,
            status: "pending",
          });
          const roles = await getRolesWithPermission("view-users-documents");
          const departmentEmails = await getEmailsByRoleAndDepartment(
            roles,
            user.department
          );

          const hrAdminEmails = await getHrAndAdminEmails();
          const mails = [...new Set([...departmentEmails, ...hrAdminEmails])];
          var index = mails.indexOf(payload?.email);
          if (index > -1) {
            mails.splice(index, 1);
          }
          const mailsString = mails.toString();
          await sendEmail(
            mailsString,
            `HR Portal - ${user.name} has requested for document.`,
            `${payload.description}`
          );

          const viewedStatus = mails.map((mail) => ({ mail, status: false }));
          const notification = new notifications({
            ...payload,
            toEmails: mails,
            subject: `${user.name} has requested for a document.`,
            type: "documentRequest",
            id: result._id,
            link: `/dashboard/documents/${result._id}`,
            viewed: viewedStatus,
          });
          const resultDocumentPOST = await documentPOST.save();
          await notification.save();
          return new NextResponse(
            JSON.stringify({ result: resultDocumentPOST, mails }),
            { status: 200 }
          );
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
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};

export const GET = async (request) => {
  try {
    const db = await connect();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const all = url.searchParams.get("all");
    const key = url.searchParams.get("key");
    if (key) {
      const user = await userData.findOne({ _id: key, status: "active" });
      if (user) {
        const result = await addRole.findOne({
          role: user.role,
          $or: [
            { permissions: "view-documents" },
            { permissions: "view-users-documents" },
          ],
        });
        if (result) {
          if (all === "true") {
            const rolesUsers = await getRolesWithPermission(
              "view-users-documents"
            );
            const rolesTeam = await getRolesWithPermission(
              "view-team-documents"
            );
            if (rolesUsers.includes(user.role)) {
              const data = await requestDocuments.find();
              return new NextResponse(JSON.stringify(data), { status: 200 });
            }
            if (rolesTeam.includes(user.role)) {
              const users = await userData.find({
                department: user?.department,
              });
              const mails = users.map((user) => user.email);
              var index = mails.indexOf(user?.email);
              if (index > -1) {
                mails.splice(index, 1);
              }
              const data = await requestDocuments.find({
                email: { $in: mails },
              });
              return new NextResponse(JSON.stringify(data), { status: 200 });
            }
          } else if (id) {
            const data = await requestDocuments.findOne({ _id: id });
            return new NextResponse(JSON.stringify(data), { status: 200 });
          } else {
            const data = await requestDocuments.find({ email: user.email });

            return new NextResponse(JSON.stringify(data), { status: 200 });
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
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};

export const PUT = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) {
      const user = await userData.findOne({
        _id: payload?.key,
        status: "active",
      });
      if (user) {
        const result = await addRole.findOne({
          role: user.role,
          permissions: "write-documents",
        });
        if (result) {
          const documentPOST = await requestDocuments.updateOne(
            { _id: payload?.id },
            { status: 'uploaded', attachment: payload?.attachment }
          );
          const post = await requestDocuments.findOne({ _id: payload?.id });
          const mails = [post?.email];
          const mailsString = mails.toString();
          await sendEmail(
            mailsString,
            `HR Portal - ${user.name} has requested for document.`,
            `${payload.description}`
          );

          const viewedStatus = mails.map((mail) => ({ mail, status: false }));
          const notification = new notifications({
            ...payload,
            toEmails: mails,
            subject: `Your document is uploaded. Please check.`,
            type: "documentRequest",
            id: payload.id,
            link: `/dashboard/documents/${payload.id}`,
            viewed: viewedStatus,
          });
          await notification.save();
          return new NextResponse(
            JSON.stringify({ result: post, mails }),
            { status: 200 }
          );
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
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
