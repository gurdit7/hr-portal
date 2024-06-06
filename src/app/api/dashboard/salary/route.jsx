import connect from "@/app/libs/mongo";
import { formatMonthName } from "@/app/utils/DateFormat";
import AppraisalForm from "@/model/AppraisalForm";
import Leaves from "@/model/addLeave";
import UserData from "@/model/userData";
import { parse } from "dotenv";
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
    const user = await UserData.findOne({
      email: "designerthefabcode@gmail.com",
    });

    const apprisal = await AppraisalForm.findOne({
      email: "designerthefabcode@gmail.com",
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
      email: "designerthefabcode@gmail.com",
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
    }

    console.log(newSlip);

    return new NextResponse(JSON.stringify({ newSlip }), { status: 200 });
  } catch (error) {
    return new NextResponse("ERROR: " + JSON.stringify(error), { status: 500 });
  }
};
