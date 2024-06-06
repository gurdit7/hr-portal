import connect from "@/app/libs/mongo";
import Leaves from "@/model/addLeave";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    await connect();
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    console.log(email)
    const date = new Date();
    const balancedPaidLeaves = 12 - (date.getMonth() + 1);
    const startDate = (date.getFullYear() - 1) + "-" + 12 + "-" + 31;  
    const sandwitchLeaves = await Leaves.find({email:email,   $or: [
        { status : 'approved' }
     ] , updatedAt: { $gte: startDate, $lt: date }});
    let paidLeaves = 0;
    prevLeaves.forEach(function (item) {
       paidLeaves += item?.paidLeaves;
    });
    let unPaidLeaves = 0;
    prevLeaves.forEach(function (item) {
        unPaidLeaves += item?.unPaidLeaves;
     });
    paidLeaves = balancedPaidLeaves - paidLeaves;
    return new NextResponse(JSON.stringify({ paidLeaves, unPaidLeaves }), {
      status: 200,
    });
}