"use client";

import { userType } from "@/app/data/default";
import DropDown from "../../Form/DropDown/select";
import H2 from "../../Ui/H2/H2";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import { useEffect, useState } from "react";
import IconSort from "../../Icons/IconSort";
import Input from "../../Form/Input/Input";
import IconSearch from "../../Icons/IconSearch";
import useAuth from "@/app/contexts/Auth/auth";
import IconEdit from "../../Icons/IconEdit";
import IconView from "../../Icons/IconView";
import Modal from "../../Ui/Modal/Modal";
import Text from "../../Ui/Text/Text";
import EditEmployee from "../../Form/EditEmployee/EditEmployee";
import Pagination from "../../Ui/Pagination/Pagination";
import { formatDate } from "@/app/utils/DateFormat";

const AllEmployees = () => {
  const [sortby, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const { userPermissions, addEmployee, setAddEmployee } = useAuth();
  const [view, setView] = useState(false);
  const [editEmployee, setEditEmployee] = useState(false);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState("");
  const [error, setError] = useState(false);
  const limit = 10;
  useEffect(() => {
    fetch("/api/dashboard/all-employee", {
      method: "POST",
      body: JSON.stringify({ index: index, limit: limit }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {
        console.log(data?.count)
        setCount(data?.count);
        setUsers(data?.data);

        if (data?.data.length === 0) {
          setError(true);
        } else {
          setError(false);
        }
        setAddEmployee(false)
      });
  }, [editEmployee, index, addEmployee]);

  const getSortBy = (e) => {
    setSortBy(e.target.value)
    fetch("/api/dashboard/filter-employee", {
      method: "POST",
      body: JSON.stringify({
        userType: e.target.value,
        index: index,
        sort:true,
        limit: 10,
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {
        setCount(data?.count);
        setUsers(data?.data);
        if (data?.data.length === 0) {
          setError(true);
        } else {
          setError(false);
        }
      });
  };
  const getSearch = (e) => {
    setSearch(e.target.value);
    fetch("/api/dashboard/filter-employee", {
      method: "POST",
      body: JSON.stringify({
        search: e.target.value,
        index: index,
        sort:false,
        limit: 10,
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {
        setCount(data?.count);
        setUsers(data?.data);
        if (data?.data.length === 0) {
          setError(true);
        } else {
          setError(false);
        }
      });
  };


  const closeViewModal = (e) => {
    setView(e);
  };
  const viewModal = (index) => {
    setUser(users[index]);
    setView(true);
  };
  const editEmployeeModal = (index) => {
    setEditEmployee(true);
    setUser(users[index]);
  };
  const closeEditModal = (e) => {
    setEditEmployee(e);
  };
  const getIndex = (e) => {
    setIndex(e);
  };
  return (
    <>  
      {userPermissions && userPermissions?.includes("view-employee") && (
        <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full">
          <Wrapper className="flex justify-between items-center">
            <H2>All Employees</H2>
            <DropDown
              items={userType}
              setData={getSortBy}
              value={sortby}
              placeholder="Sort By"
              name="Sort By"
              className="!flex-none max-w-[195px] w-full"
            >
              <IconSort size="24px" color="fill-light-400" />
            </DropDown>
          </Wrapper>
          <Input
            value={search}
            setData={getSearch}
            type="text"
            placeholder="Search"
            name="Search"
            wrapperClassName="!flex-none"
            className="border border-light-600"
          >
            <IconSearch size="24px" color="fill-light-400" />
          </Input>
          <Wrapper>
            <Wrapper className="flex bg-dark-blue">
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
                {" "}
                S.no{" "}
              </Wrapper>
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
                Name
              </Wrapper>
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
                Department
              </Wrapper>
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
                Designation
              </Wrapper>
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
                Increment Date
              </Wrapper>
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
                Actions
              </Wrapper>
            </Wrapper>
            <Wrapper className="border border-light-500 border-t-0">
              {users &&
                users.map((user, i) => (
                  <Wrapper
                    key={i}
                    className={` flex items-center ${i} ${
                      i > 0 ? "border-t border-light-500" : ""
                    }`}
                  >
                    <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize">
                      {index > 0 ? i + 1 + limit * index : i + 1}
                    </Wrapper>
                    <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize">
                      {user.name}
                    </Wrapper>
                    <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize">
                      {user.department}
                    </Wrapper>
                    <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize">
                      {user.designation}
                    </Wrapper>
                    <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize">
                      {formatDate(user.incrementDate)}
                    </Wrapper>
                    <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark flex gap-[2px]">
                      <span
                        onClick={() => editEmployeeModal(i)}
                        className="rounded-full w-[30px] h-[30px] bg-accent flex justify-center items-center cursor-pointer hover:scale-110"
                      >
                        <IconEdit size="16px" color="fill-white" />
                      </span>
                      <span
                        onClick={() => viewModal(i)}
                        className="rounded-full w-[30px] h-[30px] bg-[#219653] flex justify-center items-center cursor-pointer hover:scale-110"
                      >
                        <IconView size="16px" color="fill-white" />
                      </span>
                    </Wrapper>
                  </Wrapper>
                ))}
            </Wrapper>
            {error && <Text className="text-center my-4">No Record Found.</Text>}
            {count > 0 && (
              <Pagination count={count} getIndex={getIndex} index={index} />
            )}
          </Wrapper>
        </Wrapper>
      )}

      {view && (
        <Modal
          opened={view}
          hideModal={closeViewModal}
          heading={"Employee - " + user?.name}
        >
          <Wrapper className="bg-white rounded-[10px] p-5 max-w-[895px] w-full m-auto max-h-[95vh] overflow-auto">
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Name</Text>
              <Text className="capitalize"> {user?.name}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Email Address</Text>
              <Text className=""> {user?.email}</Text>
            </Wrapper>

            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Join Date</Text>
              <Text className="capitalize"> {formatDate(user?.joinDate)}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Role</Text>
              <Text className="capitalize"> {user?.role}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Department</Text>
              <Text className="capitalize"> {user?.department}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> DOB</Text>
              <Text className="capitalize"> {formatDate(user?.DOB)}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Gender</Text>
              <Text className="capitalize"> {user?.gender}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Increment Date</Text>
              <Text className="capitalize"> {formatDate(user?.incrementDate)}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> User Type</Text>
              <Text className="capitalize"> {user?.userType}</Text>
            </Wrapper>
            
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400">Status</Text>
              <Text className="capitalize"> {user?.status || "active"}</Text>
            </Wrapper>
            <Wrapper className='border border-dark-blue px-4'>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500  ">
              <Text > Total Leave Taken </Text>
              <Text className=""> {user?.totalLeaveTaken}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500  ">
              <Text > Balanced Leaves</Text>
              <Text className=""> {user?.balancedLeaves}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500  ">
              <Text > Sandwich Leaves Taken</Text>
              <Text className=""> {user?.balancedSandwichLeavesTaken}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px]  ">
              <Text > Balanced Sandwich Leaves</Text>
              <Text className=""> {user?.balancedSandwichLeaves}</Text>
            </Wrapper>
            </Wrapper>
          </Wrapper>
        </Modal>
      )}
      {editEmployee && (
        <Modal
          opened={editEmployee}
          hideModal={closeEditModal}
          heading={"Edit Employee - " + user?.name}
        >
          <Wrapper className="max-w-[510px] m-auto">
            <EditEmployee user={user} closePopup={closeEditModal} />
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default AllEmployees;
