"use client";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import useAuth from "@/app/contexts/Auth/auth";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import { formatMonthName, formatYear } from "@/app/utils/DateFormat";
import { PriceFormatter } from "@/app/utils/PriceFormatter";
import { useEffect, useState, useCallback } from "react";
import { CSVLink } from "react-csv";

const CreateSalary = () => {
  const { setBreadcrumbs } = useThemeConfig();
  const { userData } = useAuth();
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showInput, setShowInput] = useState({});
  const [textInput, setTextInput] = useState({});
  const [data, setData] = useState([]);
  const month =
    "Employees-Salary-" +
    formatMonthName(new Date()) +
    "-" +
    formatYear(new Date());
  useEffect(() => {
    if (userData) {
      fetchUsers(setUsers, userData);
      fetchLeaves(setLeaves, userData?._id);
    }
  }, [userData]);
  useEffect(() => {
    const breadcrumbs = [
      {
        href: "/dashboard/salary",
        label: "Salary",
      },
      {
        href: "/dashboard/create-salary",
        label: "Create Salary",
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, []);
  const calculateLeavesHours = useCallback(
    (mail, currentSalary) => {
      if (leaves && leaves.length > 0) {
        const date = new Date();
        const daysInMonth = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).getDate();

        const leaveHours = leaves.map((leave) => {
          if (leave.email === mail) {
            if (leave.sandwitchLeave) {
              if (leave?.sandwitchLeaveData?.both && !leave?.unPaidLeaves) {
                return leave?.sandwitchLeaveData?.unpaidLeaves * 3 * 8;
              } else if (
                leave?.sandwitchLeaveData.type === "paid" &&
                leave?.sandwitchLeaveData?.both &&
                leave?.unPaidLeaves
              ) {
                return (
                  (leave?.unPaidLeaves +
                    leave?.sandwitchLeaveData?.unpaidLeaves * 3) *
                  8
                );
              } else if (
                leave?.sandwitchLeaveData.type === "unpaid" &&
                leave?.unPaidLeaves
              ) {
                return (
                  (leave?.unPaidLeaves +
                    leave?.sandwitchLeaveData?.unpaidLeaves * 3) *
                  8
                );
              } else if (
                leave?.sandwitchLeaveData.type === "paid" &&
                leave?.unPaidLeaves
              ) {
                return leave?.unPaidLeaves * 8;
              } else {
                return (
                  (leave?.unPaidLeaves +
                    leave?.sandwitchLeaveData?.unpaidLeaves * 3) *
                  8
                );
              }
            } else if (leave?.unPaidLeaves) {
              return leave?.unPaidLeaves * 8;
            }
          } else {
            return 0;
          }
        });
        const sumofLeaves = (sum, num) => {
          return sum + num;
        };
        const totalHours = leaveHours.reduce(sumofLeaves);
        const oneDaySalary = currentSalary / daysInMonth;
        const leaveDays = totalHours / 8;
        return Math.round(leaveDays * oneDaySalary);
      }
    },
    [leaves]
  );
  const calculateLeaves = useCallback(
    (mail, value) => {
      if (leaves && leaves.length > 0) {
        const leaveHours = leaves.map((leave) => {
          if (leave.email === mail) {
            if (leave.sandwitchLeave) {
              if (leave?.sandwitchLeaveData?.both && !leave?.unPaidLeaves) {
                return {
                  sandwich: true,
                  both: true,
                  paid: leave?.sandwitchLeaveData?.paidLeaves,
                  unpaid: leave?.sandwitchLeaveData?.unpaidLeaves,
                };
              } else if (
                leave?.sandwitchLeaveData.type === "paid" &&
                leave?.sandwitchLeaveData?.both &&
                leave?.unPaidLeaves
              ) {
                return {
                  sandwich: true,
                  both: true,
                  paid: leave?.sandwitchLeaveData?.paidLeaves,
                  unpaid: leave?.sandwitchLeaveData?.unpaidLeaves,
                  unPaidLeaves: leave?.unPaidLeaves,
                };
              } else if (
                leave?.sandwitchLeaveData.type === "unpaid" &&
                leave?.unPaidLeaves
              ) {
                return {
                  sandwich: true,
                  paid: 0,
                  unpaid: leave?.sandwitchLeaveData?.unpaidLeaves,
                  unPaidLeaves: leave?.unPaidLeaves,
                };
              } else if (
                leave?.sandwitchLeaveData.type === "paid" &&
                leave?.unPaidLeaves
              ) {
                return {
                  sandwich: true,
                  paid: leave?.sandwitchLeaveData?.paidLeaves,
                  unpaid: 0,
                  unPaidLeaves: leave?.unPaidLeaves,
                };
              } else {
                return {
                  sandwich: true,
                  paid: leave?.sandwitchLeaveData?.paidLeaves,
                  unpaid: leave?.sandwitchLeaveData?.unpaidLeaves,
                  unPaidLeaves: leave?.unPaidLeaves,
                };
              }
            } else {
              return {
                sandwich: false,
                paidLeaves: leave?.paidLeaves,
                unPaidLeaves: leave?.unPaidLeaves,
              };
            }
          } else {
            return { sandwich: false, paidLeaves: 0, unPaidLeaves: 0 };
          }
        });
        let paid = 0,
          sandwich = false,
          unpaid = 0,
          unPaidLeaves = 0,
          paidLeaves = 0;
        leaveHours.map((item) => {
          paid += item?.paid || 0;
          unpaid += item?.unpaid || 0;
          paidLeaves += item?.paidLeaves || 0;
          unPaidLeaves += item?.unPaidLeaves || 0;
          if (item?.sandwich) {
            sandwich = true;
          }
        });
        if (value === "paidSandwich") {
          return paid || 0;
        }
        if (value === "unpaidSandwich") {
          return unpaid || 0;
        }
        if (value === "unPaidLeaves") {
          return unPaidLeaves || 0;
        }
        if (value === "paidLeaves") {
          return paidLeaves || 0;
        }
      }
    },
    [leaves]
  );

  const getFinalSalary = (total, bonus, deducted) => {
    return (
      parseFloat(total) + parseFloat(bonus || 0) - parseFloat(deducted || 0)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTextInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleInputVisibility = (e) => {
    const name = e.target.dataset.name;
    setShowInput((prev) => {
      if (prev[name]) return prev;
      return {
        ...prev,
        [name]: true,
      };
    });
  };

  useEffect(() => {
    const updatedData = users.map((user, i) => {
      calculateLeaves(user.email);
      const deducted =
        textInput[`index_SalaryDeducted_${i}`] ||
        calculateLeavesHours(user.email, user.currentSalary);
      const bonus = textInput[`index_${i}`] || 0;
      const finalSalary = getFinalSalary(user.currentSalary, bonus, deducted);
      const comments = textInput[`index_comment_${i}`] || "";

      return {
        index: i+1,
        name: user.name,
        salary: user.currentSalary,
        salaryDeducted: deducted,
        bonus: bonus,
        paidLeaves: calculateLeaves(user.email, "paidLeaves"),
        unPaidLeaves: calculateLeaves(user.email, "unPaidLeaves"),
        paidSandwich: calculateLeaves(user.email, "paidSandwich"),
        unpaidSandwich: calculateLeaves(user.email, "unpaidSandwich"),
        thisMonth: finalSalary,
        comments: comments,
      };
    });
    setData(updatedData);
  }, [textInput, users, calculateLeavesHours]);

  const headers = [
    { label: "S.no", key: "index" },
    { label: "Employee Name", key: "name" },
    { label: "Salary", key: "salary" },
    { label: "Paid Leaves", key: "paidLeaves" },
    { label: "Unpaid Leaves", key: "unPaidLeaves" },
    { label: "Paid Sandwich", key: "paidSandwich" },
    { label: "Unpaid Sandwich", key: "unpaidSandwich" },
    { label: "Salary Deducted", key: "salaryDeducted" },
    { label: "Bonus", key: "bonus" },
    { label: "This Month Salary", key: "thisMonth" },
    { label: "Comments", key: "comments" },
  ];
  return (
    <Wrapper>
      <div className="relative overflow-x-auto mt-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:bg-gray-600 table-fixed">
          <thead className="text-xs text-gray-700 uppercase bg-dark-blue  dark:text-gray-400">
            <tr className="bg-dark-blue dark:bg-gray-600">
              {[
                "S.no",
                "Employee Name",
                "Salary",
                "Paid Leaves",
                "Unpaid Leaves",
                "Paid Sandwich",
                "Unpaid Sandwich",
                "Salary Deducted",
                "Bonus",
                "This Month Salary",
                "Comments",
              ].map((header, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="text-sm font-medium font-poppins p-[10px] text-white"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={i}
                className="odd:bg-white  odd:dark:bg-gray-700 even:bg-light-100 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td className="p-[10px] text-black dark:text-white">{i + 1}</td>
                <td className="p-[10px] text-black dark:text-white">{user.name}</td>
                <td className="p-[10px] text-black dark:text-white">{PriceFormatter.format(user.currentSalary)}</td>
                <td className="p-[10px] text-black dark:text-white">
                  {calculateLeaves(user.email, "paidLeaves")}
                </td>
                <td className="p-[10px] text-black dark:text-white">
                  {calculateLeaves(user.email, "unPaidLeaves")}
                </td>
                <td className="p-[10px] text-black dark:text-white">
                  {calculateLeaves(user.email, "paidSandwich")}
                </td>
                <td className="p-[10px] text-black dark:text-white">
                  {calculateLeaves(user.email, "unpaidSandwich")}
                </td>

                <td
                  className="p-[10px] text-red-500 font-semibold relative"
                  onClick={toggleInputVisibility}
                  data-name={`index_SalaryDeducted_${i}`}
                >
                  {showInput[`index_SalaryDeducted_${i}`] ? (
                    <input
                      autoFocus
                      className="absolute top-0 left-0 w-full h-full p-[10px] bg-transparent"
                      type="number"
                      onChange={handleInputChange}
                      name={`index_SalaryDeducted_${i}`}
                      value={
                        textInput[`index_SalaryDeducted_${i}`] ||
                        calculateLeavesHours(user.email, user.currentSalary) ||
                        "-"
                      }
                    />
                  ) : (
                    textInput[`index_SalaryDeducted_${i}`] ||
                    calculateLeavesHours(user.email, user.currentSalary) ||
                    "-"
                  )}
                </td>
                <td
                  className="p-[10px] text-black dark:text-white relative"
                  onClick={toggleInputVisibility}
                  data-name={`index_${i}`}
                >
                  {showInput[`index_${i}`] ? (
                    <input
                      autoFocus
                      className="absolute top-0 left-0 w-full h-full p-[10px] bg-transparent"
                      type="number"
                      onChange={handleInputChange}
                      name={`index_${i}`}
                      value={textInput[`index_${i}`] || ""}
                    />
                  ) : (
                    textInput[`index_${i}`] || 0
                  )}
                </td>
                <td className="p-[10px] dark:text-white text-base font-semibold">
                  {PriceFormatter.format(getFinalSalary(
                    user.currentSalary,
                    textInput[`index_${i}`] || 0,
                    textInput[`index_SalaryDeducted_${i}`] ||
                      calculateLeavesHours(user.email, user.currentSalary)
                  ))}
                </td>
                <td className="text-black dark:text-white relative">
                  <textarea
                    className="w-full !min-h-11 p-[10px] bg-transparent h-11 block"
                    onChange={handleInputChange}
                    name={`index_comment_${i}`}
                    value={textInput[`index_comment_${i}`] || ""}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="flex space-x-2 justify-center items-center dark:invert mt-10">
            <span className="sr-only">Loading...</span>
            <div className="h-4 w-4 bg-dark rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-4 w-4 bg-dark rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-4 w-4 bg-dark rounded-full animate-bounce"></div>
          </div>
        )}
      </div>
      {users.length > 0 && (
        <Wrapper className="flex justify-center mt-4">
          <CSVLink
            data={data}
            headers={headers}
            filename={month}
            className="max-w-[250px] block bg-accent w-full  rounded-lg text-base font-poppins font-medium py-[15px] text-white hover:bg-dark-blue text-center"
          >
            Download CSV
          </CSVLink>
        </Wrapper>
      )}
    </Wrapper>
  );
};

export default CreateSalary;

export const fetchUsers = async (setUsers, userData) => {
  const res = await fetch("/api/dashboard/employee?key=" + userData?._id);
  const data = await res.json();
  setUsers(data?.data || []);
};

export const fetchLeaves = async (setLeaves, key) => {
  try {
    const res = await fetch(
      `/api/dashboard/leaves?all=salary&key=${key}`
    );
    const result = await res.json();
    setLeaves(result || []);
  } catch (error) {
    console.error("Error fetching leave data:", error);
  }
};
