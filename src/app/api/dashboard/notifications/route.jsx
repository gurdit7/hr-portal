import { NextResponse, NextRequest } from "next/server";
import connect from "../../../libs/mongo/index";
import Notifications from "@/model/notifications";

export const GET = async (request) => {
  try {
    await connect();  
    const data = await Notifications.find()
      .then((userExist) => {
        if (userExist) {
          return userExist;
        }
      })
      .then((res) => {
        return res;
      });
      return new NextResponse(JSON.stringify(data), { status: 200 });
    }
    catch (error) {
        return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
      }
};

export const POST = async (request) => {
    try {
      await connect();  
      const payload = await request.json();
      console.log(payload)
      const date = new Date();
      const notifications = new Notifications({
        email: payload?.email,
        subject: 'Leave On Monday',
        attachment: 'https://thefabcode.org/wp-content/uploads/2022/12/aboutagency.png',
        description: `Dear Sir, I hope this email finds you well. I am writing to inform you that I need to request a short leave from work today, 10-04-20204, due to an unexpected situation. Unfortunately, my eyeglasses broke today in morning, and I am unable to carry out my duties effectively without them. As such, I need to visit the optician's shop urgently to have them repaired or replaced. Given the nature of my work and the importance of clear vision, it's essential for me to resolve this issue promptly. I assure you that I will make every effort to minimize disruption to my tasks and team responsibilities during this short absence. I plan to complete any pending assignments before leaving and will ensure that my colleagues are briefed on any ongoing projects. I anticipate that the visit to the optician will not take more than a few hours. Thank you for your understanding and cooperation in this matter. Please let me know if there are any specific arrangements or instructions you would like to provide.<br> Best regards, <br>Gurdit Singh`,
        sendDate: date
      });
      const result = await notifications.save();
        return new NextResponse(JSON.stringify(result), { status: 200 });
      }  catch (error) {
          return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
        }
  };
