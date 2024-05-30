import { NextResponse, NextRequest } from "next/server";
import connect from "../../../libs/mongo/index";
import Leaves from "@/model/addLeave";
import UsersData from "@/model/userData";

export const POST = async (request) => {
  try {
    const db = await connect();
    const payload = await request.json();
    const date = new Date().getTime().toString(36);
    const leaves = new Leaves({
      name: payload?.name,
      email: payload?.email,
      userID: payload?.userID,
      duration: payload?.duration,
      durationDate: payload?.durationDate,
      durationHours: payload?.durationHours,
      subject: payload?.subject,
      description: payload?.description,
      attachment: payload?.attachment,
      from: payload?.from,
      to: payload?.to,
      status: "pending",
    });
    const result = await leaves.save();
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};

export const GET = async (request) => {
  try {
    const db = await connect();
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const id = url.searchParams.get("id");
    const all = url.searchParams.get("all");
    if (all === "true") {
      const leaves = await Leaves.find();
      return new NextResponse(JSON.stringify(leaves), { status: 200 });
    }
    if (!id && !all) {
      if (!email) {
        return new NextResponse(
          JSON.stringify({ error: "Email not provided" }),
          { status: 400 }
        );
      }
      const leaves = await Leaves.find({ email: email })
        .sort({ $natural: -1 })
        .then(async (data) => {
          if (data) {
            const userData = await UsersData.findOne({ email: email }).then(
              async (data) => {
                return {
                  name: data?.name,
                  email: data?.email,
                };
              }
            );
            return { leaves: data, user: userData };
          } else {
            return { error: "User Not Found", status: 404 };
          }
        })
        .then((res) => {
          return res;
        });
      return new NextResponse(JSON.stringify(leaves), { status: 200 });
    }
    if (id && !all) {
      const leaves = await Leaves.findOne({ _id: id });
      const result = await UsersData.findOne({ email: leaves?.email });
      return new NextResponse(
        JSON.stringify({ leaves: leaves, user: result }),
        { status: 200 }
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
    if (payload?.update === "leaves") {
      const userDataRo = await UsersData.updateOne(
        { email: payload?.email },
        {
          totalLeaveTaken: payload?.totalLeaveTaken,
          balancedLeaves: payload?.balancedLeaves,
          balancedSandwichLeaves: payload?.balancedSandwichLeaves,
          balancedSandwichLeavesTaken: payload?.balancedSandwichLeavesTaken,
        }
      )
        .then((res) => {
          return res;
        })
        .then(async (res) => {
          const result = await UsersData.findOne({ email: payload?.email });
          return result;
        });
      return new NextResponse(JSON.stringify(userDataRo), { status: 200 });
    } else if (payload?.update === "cancel") {
      const userDataPerson = await Leaves.updateOne(
        { _id: payload?.id },
        {
          status: payload?.status,
        }
      )
        .then((res) => {
          return res;
        })
        .then(async (res) => {
          const userDataRo = await UsersData.updateOne(
            { email: payload?.email },
            {
              totalLeaveTaken: payload?.totalLeaveTaken,
              balancedLeaves: payload?.balancedLeaves,
              balancedSandwichLeaves: payload?.balancedSandwichLeaves,
              balancedSandwichLeavesTaken: payload?.balancedSandwichLeavesTaken,
            }
          )
            .then((res) => {
              return res;
            })
            .then(async (res) => {
              const result = await UsersData.findOne({ email: payload?.email });
              return result;
            });

          return userDataRo;
        });
      return new NextResponse(JSON.stringify(userDataPerson), { status: 200 });
    } else {
      const userDataPerson = await Leaves.updateOne(
        { _id: payload?.id },
        {
          status: payload?.status,
          reason: payload?.reason,
        }
      )
        .then((res) => {
          return res;
        })
        .then(async (res) => {
          const leave = await Leaves.findOne({ _id: payload?.id });
          const userDataRo = await UsersData.updateOne(
            { email: payload?.email },
            {
              totalLeaveTaken: payload?.totalLeaveTaken,
              balancedLeaves: payload?.balancedLeaves,
              balancedSandwichLeaves: payload?.balancedSandwichLeaves,
              balancedSandwichLeavesTaken: payload?.balancedSandwichLeavesTaken,
            }
          )
            .then((res) => {
              return res;
            })
            .then(async (res) => {
              const result = await UsersData.findOne({ email: payload?.email });
              return { leave: leave, user: result };
            });

          return userDataRo;
        });
      return new NextResponse(JSON.stringify(userDataPerson), { status: 200 });
    }
  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
