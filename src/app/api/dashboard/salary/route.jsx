import connect from "@/app/libs/mongo";
import AppraisalForm from "@/model/AppraisalForm";
import UserData from "@/model/userData";
import { NextResponse } from "next/server";
export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    const date = new Date();
    const lastMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    const lastThirdMonth = new Date(date.getFullYear(), date.getMonth() - 2, 1);    
    const user = await UserData.findOne({
        email: "designerthefabcode@gmail.com"
    })
    const apprisal = await AppraisalForm.findOne({
      email: "designerthefabcode@gmail.com",
      status: "approved",
      updatedAt: { $gte: lastThirdMonth, $lt: lastMonth },
    }).then((res)=>{
        if(res){
            const salaryOffered  = res?.salaryOffered.replace(',', '');
            console.log(salaryOffered - user?.currentSalary)
        }
        else{
            return null;
        }
    });

    return new NextResponse(
      JSON.stringify({ lastThirdMonth: lastThirdMonth, lastMonth: lastMonth, apprisal:apprisal }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
