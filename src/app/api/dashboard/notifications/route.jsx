import { NextResponse, NextRequest } from "next/server";
import connect from "../../../libs/mongo/index";
import Notifications from "@/model/notifications";
import requestDocuments from "@/model/requestDocuments";
import AppraisalForm from "@/model/AppraisalForm";
import addLeave from "@/model/addLeave";

export const GET = async (request) => {
  try {
    await connect();
    const url = new URL(request.url);
    const all = url.searchParams.get("all");
    const filter = url.searchParams.get("filter");
    const start = url.searchParams.get("start");
    const limit = url.searchParams.get("limit");
    const email = url.searchParams.get("email");
    if (all === "false") {
      const data = await Notifications.find({email:email})
        .then((userExist) => {
          if (userExist) {
            return userExist;
          }
        })
        .then((res) => {
          return res;
        });        
      return new NextResponse(JSON.stringify({ data: data, length: data.length }), { status: 200 });
    } else if (filter === "search") {
      const search = url.searchParams.get("search");
      const data = await requestDocuments
        .find({
          $or: [
            { document: { $regex: search } },
            { description: { $regex: search } },
            { status: { $regex: search } },
            { email: { $regex: search } }            
          ],
        })
        .limit(limit)
        .skip(limit * start)
        .sort({ $natural: -1 });
      return new NextResponse(
        JSON.stringify({ data: data, length: data.length }),
        {
          status: 200,
        }
      );
    } else {
      const requestDocument = await requestDocuments.find().sort({$natural:-1});
      const notification = await Notifications.find().sort({$natural:-1});
      const appraisal = await AppraisalForm.find().sort({$natural:-1});
      const leaves = await addLeave.find().sort({$natural:-1});      
      const allNotifications = [];      
      allNotifications.push(...requestDocument);
      allNotifications.push(...appraisal);
      allNotifications.push(...notification);
      allNotifications.push(...leaves);
      
      const result = allNotifications.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });      
      const data = result.slice(start, Math.floor(start) + Math.floor(limit));
      return new NextResponse(
        JSON.stringify({ data: data, length: result.length }),
        { status: 200 }
      );
      
    }
  } catch (error) {
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    const date = new Date();
    const notifications = new Notifications({
      email: payload?.emails,
      subject: payload?.subject,
      attachment: payload?.attachment,
      description: payload?.description,
      name: payload?.name,
      sendDate: payload?.sendDate,
    });
    const result = await notifications.save();
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
