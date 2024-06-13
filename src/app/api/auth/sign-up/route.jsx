import { NextResponse, NextRequest } from "next/server";
import connect from "../../../libs/mongo/index";
import Users from "../../../../model/userModel";
import UsersData from "../../../../model/userData";
import bcrypt from "bcrypt";
import userData from "../../../../model/userData";
import Roles from "@/model/addRole";

export const POST = async (request) => {
  try {
    const db = await connect();
    const payload = await request.json();
    const key = payload?.key;
    if (key) {
      const apiKey = key.replace("f6bb694916a535eecf64c585d4d879ad_", "");
      const user = await userData.findOne({ _id: apiKey });
      const data = await Roles.find({
        role: user?.role,
        permissions: "write-employees",
      });
      if (data && data.length > 0) {
        if (user) {
          const dateFirst = new Date();
          const finalDate =
            dateFirst.getTime() + dateFirst.getFullYear() + dateFirst.getDate();
          const date = finalDate.toString(36);
          const person = new Users({
            email: payload?.email,
            userID: date,
            password: await bcrypt.hash("fc@123456", 10),
          });
          const data = await Users.findOne({ email: payload?.email })
            .then((userExist) => {
              if (userExist) {
                return { user: true };
              }
            })
            .then((res) => {
              return res;
            });
          if (data?.user === true) {
            data.message = "User Already Exist";
            data.status = 403;
            return new NextResponse(JSON.stringify(data), { status: 200 });
          } else {
            const result = await person.save();
            if (result) {
              const totalLeaves = 12;
              const dateNow = new Date();
              const currentMonth = new Date().getMonth();
              const totalLeave = totalLeaves - currentMonth;
              const monthRound = Math.round((dateNow.getMonth() + 2) - 0.5);              
              const balancedSandwichLeaves = Math.ceil(monthRound / 3);
              const userDataPerson = new UsersData({
                email: payload?.email,
                userType: payload?.userType,
                userID: date,
                name: payload?.name,
                joinDate: payload?.joinDate,
                designation: payload?.designation,
                role: payload?.role,
                gender: payload?.gender,
                department: payload?.department,
                DOB: payload?.DOB,
                incrementDate: payload?.incrementDate,
                currentSalary: payload?.currentSalary,
                totalLeaveTaken: 0,
                balancedLeaves: totalLeave,
                balancedSandwichLeaves: balancedSandwichLeaves,
                balancedSandwichLeavesTaken: 0,
                status: "active",
              });
              await userDataPerson.save();
            }
            return new NextResponse(JSON.stringify(result), { status: 200 });
          }
        }
      } else {
        return new NextResponse(
          JSON.stringify({ error: "You Don't have permissions" }),
          {
            status: 403,
          }
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Please add a API key." }),
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
            errors: error,
          }),
        { status: 500 }
      );
    }
  }
};
