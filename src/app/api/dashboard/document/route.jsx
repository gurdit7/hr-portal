import connect from "@/app/libs/mongo";
import requestDocuments from "@/model/requestDocuments";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request) => {
  try {
    const db = await connect();
    const payload = await request.json();
    const documentPOST = new requestDocuments({
      email: payload?.email,
      userID: payload?.userID,
      document: payload?.document,
      description: payload?.description,
      name: payload?.name,
      status: "pending",
      file: "",
    });
    const result = await documentPOST.save();
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
    const email = url.searchParams.get('email');
    const all = url.searchParams.get('all');
    if (!email) {
        return new NextResponse(JSON.stringify({ error: 'Email ID not provided' }), { status: 400 });
      }
    if (all === "true") {
      const data = await requestDocuments.find().sort({ $natural: -1 });
      return new NextResponse(JSON.stringify(data), { status: 200 });
    } else {
      const data = await requestDocuments
        .find({ email: email })
        .then(async (userExist) => {
          if (userExist) {
            return userExist;
          } else {
            return { error: "Not Found" };
          }
        })
        .then((res) => {
          return res;
        });
      return new NextResponse(JSON.stringify(data), { status: 200 });
    }
  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
