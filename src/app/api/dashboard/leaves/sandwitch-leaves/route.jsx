import connect from "@/app/libs/mongo";
import Leaves from "@/model/addLeave";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try{
    await connect();
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const date = new Date();
    const lastThirdMonth = new Date(date.getFullYear(), date.getMonth() - 3, 0);
    const lastMonth = new Date(date.getFullYear(), date.getMonth() - 3, 0);
    const sandwitchLeaves = await Leaves.find({email:email, sandwitchLeave : true, 'sandwitchLeaveData.type': 'paid', updatedAt: { $gte: lastThirdMonth, $lt: date }});
    return new NextResponse(JSON.stringify({ sandwitchLeaves }), {
      status: 200,
    });
  }
  catch (error) {
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
}

export const PUT = async (request) => {
  await connect();
  const payload = await request.json();
  const date = new Date();
  const month = date.getMonth() + 1;  
  if(month === 3 || month === 6 || month === 9 || month === 12){
  let balancedSandwichLeaves = 4 - month / 3;  
  
  const startDate = (date.getFullYear() - 1) + "-" + 12 + "-" + 31;  
  const prevLeaves = await Leaves.find({email:email,   $or: [
      { status : 'approved' },
      { status : 'unpaid' },
   ] , updatedAt: { $gte: startDate, $lt: date }});
  return new NextResponse(JSON.stringify({ balancedSandwichLeaves }), {
    status: 200,
  });
  const leaves = Leaves.find()
  }
}