import connect from "@/app/libs/mongo";
import AppraisalForm from "@/model/AppraisalForm";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const db =  await connect();
    const payload = await request.json();    
    const appraisal = new AppraisalForm({
      email: payload?.email,
      userID: payload?.userID,
      ExpectedSalary: payload?.ExpectedSalary,
      description: payload?.description,      
      name: payload?.name,
      status: 'pending',
      file: ''
    });
    const result = await appraisal.save();
    return new NextResponse(JSON.stringify(result), { status: 200 });

  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};

