"use client";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import useAuth from "@/app/contexts/Auth/auth";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import { formatMonthName, formatYear } from "@/app/utils/DateFormat";
import { useEffect, useState, useCallback } from "react";
import { CSVLink } from "react-csv";

const CreateSalary = () => {
  const {setBreadcrumbs} = useThemeConfig();
  const {userData} = useAuth();
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showInput, setShowInput] = useState({});
  const [textInput, setTextInput] = useState({});
  const [data, setData] = useState([]);
  const month = "Employees-Salary-" + formatMonthName(new Date()) + "-" + formatYear(new Date());
  useEffect(() => {
    if(userData){
    fetchUsers(setUsers);
    fetchLeaves(setLeaves,userData?._id);
    }
  }, [userData]);
  useEffect(() => {
    const breadcrumbs = [
      {
        href: "/dashboard/create-salary",
        label: "Create Salary",
      }
    ];
    setBreadcrumbs(breadcrumbs);
  }, []);
  const calculateLeaves = useCallback((mail, currentSalary) => {
    if(leaves && leaves.length > 0){
    const date = new Date();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const leaveHours = leaves.filter(leave => leave.email === mail).reduce((acc, leave) => acc + leave.durationHours, 0);
    const oneDaySalary = currentSalary / daysInMonth;
    const leaveDays = leaveHours / 8;
    return leaveDays * oneDaySalary;
    }
  }, [leaves]);

  const getFinalSalary = (total, bonus, deducted) => {
    return parseFloat(total) + parseFloat(bonus || 0) - parseFloat(deducted || 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTextInput(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleInputVisibility = (e) => {
    const name = e.target.dataset.name;
    setShowInput(prev => {
      if (prev[name]) return prev; 
      return {
        ...prev,
        [name]: true,
      };
    });
  };

  useEffect(() => {
    const updatedData = users.map((user, i) => {
      const deducted = textInput[`index_SalaryDeducted_${i}`] || calculateLeaves(user.email, user.currentSalary);
      const bonus = textInput[`index_${i}`] || 0;
      const finalSalary = getFinalSalary(user.currentSalary, bonus, deducted);
      const comments = textInput[`index_comment_${i}`] || "";

      return {
        index: i,
        name: user.name,
        salary: user.currentSalary,
        salaryDeducted: deducted,
        bonus: bonus,
        thisMonth: finalSalary,
        comments: comments,
      };
    });
    setData(updatedData);
  }, [textInput, users, calculateLeaves]);

  const headers = [
	{ label: "S.no", key: "index" },
	{ label: "Employee Name", key: "name" },
	{ label: "Salary", key: "salary" },
	{ label: "Salary Deducted", key: "salaryDeducted" },
	{ label: "Bonus", key: "bonus" },
	{ label: "This Month Salary", key: "thisMonth" },
	{ label: "Comments", key: "comments" },
  ];  
  return (
	<Wrapper>
    <div className="relative overflow-x-auto mt-4">	
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
        <thead className="text-xs text-gray-700 uppercase bg-dark-blue dark:bg-gray-700 dark:text-gray-400">
          <tr className="bg-dark-blue">
            {["S.no", "Employee Name", "Salary", "Salary Deducted", "Bonus", "This Month Salary", "Comments"].map((header, idx) => (
              <th key={idx} scope="col" className="text-sm font-medium font-poppins p-[10px] text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={i} className="odd:bg-white odd:dark:bg-gray-900 even:bg-light-100 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td className="p-[10px] text-black">{i + 1}</td>
              <td className="p-[10px] text-black">{user.name}</td>
              <td className="p-[10px] text-black">{user.currentSalary}</td>
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
                    value={textInput[`index_SalaryDeducted_${i}`] || calculateLeaves(user.email, user.currentSalary) || '-'}
                  />
                ) : (
                  textInput[`index_SalaryDeducted_${i}`] || calculateLeaves(user.email, user.currentSalary) || '-'
                )}
              </td>
              <td
                className="p-[10px] text-black relative"
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
                    value={textInput[`index_${i}`] || ''}
                  />
                ) : (
                  textInput[`index_${i}`] || 0
                )}
              </td>
              <td className="p-[10px] text-dark-blue text-base font-semibold">
                {getFinalSalary(
                  user.currentSalary,
                  textInput[`index_${i}`] || 0,
                  textInput[`index_SalaryDeducted_${i}`] || calculateLeaves(user.email, user.currentSalary)
                )}
              </td>
              <td className="text-black relative">
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
					<div className='flex space-x-2 justify-center items-center dark:invert mt-10'>
					<span className='sr-only'>Loading...</span>
					 <div className='h-4 w-4 bg-dark rounded-full animate-bounce [animation-delay:-0.3s]'></div>
				   <div className='h-4 w-4 bg-dark rounded-full animate-bounce [animation-delay:-0.15s]'></div>
				   <div className='h-4 w-4 bg-dark rounded-full animate-bounce'></div>
			   </div>
				 )}
    </div>
	{users.length > 0 && (
		  <Wrapper className='flex justify-center mt-4'>
		  <CSVLink data={data} headers={headers} filename={month} className="max-w-[250px] block bg-accent w-full  rounded-lg text-base font-poppins font-medium py-[15px] text-white hover:bg-dark-blue text-center">
		Download CSV
	  </CSVLink>
	  </Wrapper>
	  )}
	  </Wrapper>
  );
};

export default CreateSalary;


export const fetchUsers = async (setUsers) => {
	const res = await fetch("/api/dashboard/all-employee", {
	  method: "POST",
	  body: JSON.stringify({ index: 0, limit: 30 }),
	});
	const data = await res.json();
	setUsers(data?.data || []);
  };

  export const fetchLeaves = async (setLeaves,key) => {
	try {
	  const res = await fetch(`/api/dashboard/leaves?all=salary&key=f6bb694916a535eecf64c585d4d879ad_${key}`);
	  const result = await res.json();
	  setLeaves(result || []);
	} catch (error) {
	  console.error("Error fetching leave data:", error);
	}
  };