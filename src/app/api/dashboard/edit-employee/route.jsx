import { NextResponse } from "next/server";
import connect from "../../../libs/mongo/index";
import userData from "../../../../model/userData"
export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    const updateData = await userData.updateOne(
        { email: payload?.email },
        {
          name:payload?.name,
          joinDate:payload?.joinDate,
          designation:payload?.designation,
          role:payload?.role,
          gender:payload?.gender,
          department:payload?.department,
          DOB:payload?.DOB,
          incrementDate:payload?.incrementDate,
          currentSalary:payload?.currentSalary,
          status:payload?.status,
          userType:payload?.userType,
          balancedLeaves:payload?.balancedLeaves,
          totalLeaveTaken:payload?.totalLeaveTaken,
          balancedSandwichLeaves:payload?.balancedSandwichLeaves,
          balancedSandwichLeavesTaken:payload?.balancedSandwichLeavesTaken          
        }
      )        
      
    return new NextResponse(JSON.stringify(updateData), { status: 200 });
  } catch (error) {
    console.log(error)
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
