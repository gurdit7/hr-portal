import connect from "@/app/libs/mongo";
import Leaves from "@/model/addLeave";
import userData from "@/model/userData";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    await connect();
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const date = new Date();    
    let startDate = (date.getFullYear() - 1) + "-" + 12 + "-" + 31;  
    const user = await userData?.findOne({email});
    const userJoinDate = new Date(user?.joinDate); 
    let lev = date.getMonth() + 2;   
    if(userJoinDate.getFullYear() === date.getFullYear()){
      lev = date.getMonth() - userJoinDate.getMonth()  + 1;
    }      
    const prevLeaves = await Leaves.find({email,   $or: [
        { status : 'approved' },
        { status : 'unpaid' },
     ] , updatedAt: { $gte: startDate, $lt: date }});
    let paidLeaves = 0; 
    prevLeaves.forEach(function (item) {
       paidLeaves += item?.paidLeaves;
    });
    let unPaidLeaves = 0;
    prevLeaves.forEach(function (item) {
        unPaidLeaves += item?.unPaidLeaves;
     });
    paidLeaves = lev - paidLeaves;
    return new NextResponse(JSON.stringify({ paidLeaves, unPaidLeaves }), {
      status: 200,
    });
}