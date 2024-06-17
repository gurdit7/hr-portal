import connect from "@/app/libs/mongo";
import { formatMonthName } from "@/app/utils/DateFormat";
import AppraisalForm from "@/model/AppraisalForm";
import Leaves from "@/model/addLeave";
import UserData from "@/model/userData";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    await connect();
    const payload = await request.json();
    const date = new Date();

    const lastMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    const secondLastMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      0
    );
    const lastThirdMonth = new Date(date.getFullYear(), date.getMonth() - 2, 0);
    const lastThirdMonthDate = new Date(
      date.getFullYear(),
      date.getMonth() - 3,
      0
    );
    const lastMonthValue =
      lastMonth.getFullYear() + "-" + (lastMonth.getMonth() + 2) + "-" + 1;
    const lastThirdMonthValue =
      lastThirdMonth.getFullYear() +
      "-" +
      (lastThirdMonthDate.getMonth() + 1) +
      "-" +
      lastThirdMonthDate.getDate();
    const user = await UserData?.findOne({
      email: "gurdit@thefabcode.org",
    });

    const apprisal = await AppraisalForm.findOne({
      email: "gurdit@thefabcode.org",
      status: "approved",
      updatedAt: { $gte: lastThirdMonthValue, $lt: lastMonthValue },
    });

    let apprisalData = {};
    if (apprisal) {
      const currentSalary = apprisal.currentSalary.replace(",", "");
      apprisalData = {
        pastSalary: currentSalary,
        month: apprisal.updatedAt,
        salary: user.currentSalary,
      };
    } else {
      apprisalData = { salary: user.currentSalary };
    }

    const leave = await Leaves.find({
      email: "gurdit@thefabcode.org",
      status: "approved",
      updatedAt: { $gte: lastThirdMonthValue, $lt: lastMonthValue },
    });
      
    const newSlip = {
      firstMonth: { month: "", salary: "", paidLeaves: "" },
      secondMonth: { month: "", salary: "", paidLeaves: "" },
      thirdMonth: { month: "", salary: "", paidLeaves: "" },
    };

    if (apprisalData.pastSalary) {
      const firstMonth = formatMonthName(lastThirdMonth);
      const secondMonth = formatMonthName(secondLastMonth);
      const thirdMonth = formatMonthName(lastMonth);
      const apprisalMonth = formatMonthName(apprisalData.month);
      let firstMonthLeaves = 0;
      let secondMonthLeaves,
        thirdMonthLeaves = 0;
      leave.forEach(function (item) {
        const month = formatMonthName(item?.updatedAt);
        if (month === firstMonth) {
          const h = parseFloat(item?.durationHours) / 8;
          firstMonthLeaves += h;
        }
        if (month === secondMonth) {
          const h = parseFloat(item?.durationHours) / 8;
          secondMonthLeaves += h;
        }
        if (month === thirdMonth) {
          const h = parseFloat(item?.durationHours) / 8;
          thirdMonthLeaves += h;
        }
      });
      function setMonthAndSalary(month, apprisalMonth, pastSalary, salary) {
        return {
          month,
          salary: month === apprisalMonth ? pastSalary : salary,
        };
      }

      newSlip.firstMonth = setMonthAndSalary(
        firstMonth,
        apprisalMonth,
        apprisalData.pastSalary,
        apprisalData.salary
      );
      newSlip.secondMonth = setMonthAndSalary(
        secondMonth,
        apprisalMonth,
        apprisalData.pastSalary,
        apprisalData.salary
      );
      newSlip.thirdMonth = setMonthAndSalary(
        thirdMonth,
        apprisalMonth,
        apprisalData.pastSalary,
        apprisalData.salary
      );

      if (secondMonth === apprisalMonth) {
        newSlip.firstMonth = setMonthAndSalary(
          firstMonth,
          firstMonth,
          apprisalData.pastSalary,
          apprisalData.salary
        );
      }

      if (thirdMonth === apprisalMonth) {
        newSlip.secondMonth = setMonthAndSalary(
          secondMonth,
          apprisalMonth,
          apprisalData.pastSalary,
          apprisalData.salary
        );
        newSlip.firstMonth = setMonthAndSalary(
          firstMonth,
          apprisalMonth,
          apprisalData.pastSalary,
          apprisalData.salary
        );
      }
      newSlip.firstMonth.paidLeaves = firstMonthLeaves || 0;
      newSlip.secondMonth.paidLeaves = secondMonthLeaves || 0;
      newSlip.thirdMonth.paidLeaves = thirdMonthLeaves || 0;
    } else {
      const firstMonth = formatMonthName(lastThirdMonth);
      const secondMonth = formatMonthName(secondLastMonth);
      const thirdMonth = formatMonthName(lastMonth);
      newSlip.firstMonth.month = firstMonth;
      newSlip.secondMonth.month = secondMonth;
      newSlip.thirdMonth.month = thirdMonth;
      newSlip.firstMonth.salary = user.currentSalary;
      newSlip.secondMonth.salary = user.currentSalary;
      newSlip.thirdMonth.salary = user.currentSalary;
      newSlip.firstMonth.paidLeaves = 0;
      newSlip.secondMonth.paidLeaves = 0;
      newSlip.thirdMonth.paidLeaves = 0;
      newSlip.firstMonth.basic = (user.currentSalary * 43) / 100;
      newSlip.firstMonth.hra = (user.currentSalary * 25) / 100;
      newSlip.firstMonth.convenienceAllow = (user.currentSalary * 19) / 100;
      newSlip.firstMonth.medicalAllow = (user.currentSalary * 13) / 100;
      newSlip.secondMonth.basic = (user.currentSalary * 43) / 100;
      newSlip.secondMonth.hra = (user.currentSalary * 25) / 100;
      newSlip.secondMonth.convenienceAllow = (user.currentSalary * 19) / 100;
      newSlip.secondMonth.medicalAllow = (user.currentSalary * 13) / 100;
      newSlip.thirdMonth.basic = (user.currentSalary * 43) / 100;
      newSlip.thirdMonth.hra = (user.currentSalary * 25) / 100;
      newSlip.thirdMonth.convenienceAllow = (user.currentSalary * 19) / 100;
      newSlip.thirdMonth.medicalAllow = (user.currentSalary * 13) / 100;
      newSlip.firstMonth.otherDeduction = 0;
      newSlip.secondMonth.otherDeduction = 0;
      newSlip.thirdMonth.otherDeduction = 0;
    }
    return new NextResponse(JSON.stringify({ newSlip }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("ERROR: " + JSON.stringify(error), { status: 500 });
  }
};
