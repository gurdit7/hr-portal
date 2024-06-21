import { NextResponse, NextRequest } from "next/server";
import connect from "../../../libs/mongo/index";
import Notifications from "@/model/notifications";
import userData from "@/model/userData";
import Roles from "@/model/addRole";
import sendEmail from "@/app/mailer/mailer";
import { getRolesWithPermission } from "../leaves/route";

export const GET = async (request) => {
  try {
    await connect();
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const email = url.searchParams.get("email");
    const id = url.searchParams.get("id");
    if (key) { 
      const user = await userData?.findOne({ _id: key, status: "active" });
      if (user) {
        const result = await Roles.findOne({
          role: user.role,
          permissions: "view-users-notifications",
        });
        const indiResult = await Roles.findOne({
          role: user.role,
          permissions: "user-notifications",
        });
        if (result && !id) {
          const rolesUsers = await getRolesWithPermission("view-users-notifications");
          const rolesTeam = await getRolesWithPermission("view-team-notifications");
          if(rolesUsers.includes(user.role)){
            
          const data = await Notifications.find({            
            $or: [{ toEmails: email }, { email: email }],
          })
            .sort({ $natural: -1 })
            .then((res) => {
              if (res) {
                return res;
              }
            })
            .then((res) => {
              return res;
            });
          const result = data.map((item) => {
            const viewedStatus = item?.viewed.find(
              (mail) => mail?.mail === email
            )?.status;
            const trash = item?.viewed.find(
              (mail) => mail?.mail === email
            )?.trashed;
            
            return {
              name: item.name,
              updatedAt: item.updatedAt,
              viewedStatus,
              trash,
              type: item.type,
              id: item.id,
              mainId: item._id,
              views: item?.viewed,
              subject: item?.subject,
              link: item?.link || `/dashboard/notifications/${item._id}`,
            };
          });
          return new NextResponse(JSON.stringify({ data: result }), {
            status: 200,
          });
        }
        if(rolesTeam.includes(user.role)){          
          const users = await userData.find({ department: user?.department });
          const mails = users.map((user) => user.email);           
          const data = await Notifications.find({
            $or: [{ toEmails: { $in: mails } }, { email: { $in: mails } }],
          })
            .sort({ $natural: -1 })
            .then((res) => {
              if (res) {
                return res;
              }
            })
            .then((res) => {
              return res;
            });
          const result = data.map((item) => {
            const viewedStatus = item?.viewed.find(
              (mail) => mail?.mail === email
            )?.status;
            const trash = item?.viewed.find(
              (mail) => mail?.mail === email
            )?.trashed;
            return {
              name: item.name,
              updatedAt: item.updatedAt,
              viewedStatus,
              trash,
              type: item.type,
              id: item.id,
              mainId: item._id,
              views: item?.viewed,
              subject: item?.subject,
              link: item?.link || `/dashboard/notifications/${item._id}`,
            };
          });
          return new NextResponse(JSON.stringify({ data: result }), {
            status: 200,
          });
        }
        } 
        else if (indiResult && id === 'true') {
          const data = await Notifications.find({ toEmails: email })
            .sort({ $natural: -1 })
            .then((res) => {
              if (res) {
                return res;
              }
            })
            .then((res) => {
              return res;
            });
          const result = data.map((item) => {
            const viewedStatus = item?.viewed.find(
              (mail) => mail?.mail === email
            )?.status;
            const trash = item?.viewed.find(
              (mail) => mail?.mail === email
            )?.trashed;
            return {
              name: item.name,
              updatedAt: item.updatedAt,
              viewedStatus,
              trash,
              type: item.type,
              views: item?.viewed,
              id: item.id,
              mainId: item._id,
              subject: item?.subject,
              link: item?.link || `/dashboard/notifications/${item._id}`,
            };
          });
          return new NextResponse(JSON.stringify({ data: result }), {
            status: 200,
          });
        }
        else if (id !== 'true') {
          const data = await Notifications.findOne({ _id:id })
            .sort({ $natural: -1 });
        
          return new NextResponse(JSON.stringify({ data }), {
            status: 200,
          });
        }  else {
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
    console.log(error);
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

export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) {
      const user = await userData?.findOne({
        _id: payload?.key,
        status: "active",
      });
      if (user) {
        const result = await Roles.findOne({
          role: user.role,
          permissions: "add-notifications",
        });
        if (result) {
          const mails = payload?.emails.split(",");
          mails.push(user?.email);
          const viewedStatus = mails.map((mail) => ({ mail, status: false }));
          const notifications = new Notifications({
            toEmails: mails,
            email: user?.email,
            viewed: viewedStatus,
            subject: payload?.subject,
            attachment: payload?.attachment,
            description: payload?.description,
            name: user?.name,
            type: "indiNotification",            
            sendDate: payload?.sendDate,
          });
          await sendEmail(
            payload?.emails,
            "HR Portal - You have recived a Notification.",
            `<h2 style='text-align:center;font-size: 200%;line-height: 1;margin: 0;'>${payload?.subject}</h2>
            <p style="text-align:center;">Description:</p>
            ${payload?.description}            
            `,
            payload?.attachment
          );
          const result = await notifications.save();
          return new NextResponse(JSON.stringify({ result, mails: mails }), {
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
    console.log(error);
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

export const PUT = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) {
      const user = await userData?.findOne({
        _id: payload?.key,
        status: "active",
      });
      if (user) {
        const result = await Roles.findOne({
          role: user.role,
          $or: [
            { permissions: "view-users-notifications" },
            { permissions: "user-notifications" },
          ],
        });
        if (result) {
          const notification = await Notifications.updateOne(
            { _id: payload.id },
            { viewed: payload.viewed }
          );
          return new NextResponse(JSON.stringify(notification), {
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


export const DELETE = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    if (payload?.key) {  
      const user = await userData?.findOne({ _id: payload?.key, status: "active" });
      const data = await Roles.find({
        role: user?.role,
        permissions: "write-roles",
      });
      if (data && data.length > 0) {
        const departments = await Notifications.deleteOne({ _id: payload?.id });
        if (departments?.deletedCount > 0) {
          return new NextResponse(
            JSON.stringify({ status: 200, deleted: true }),
            {
              status: 200,
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
