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

const AllEmployees = () => {
  const [sortby, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const { userPermissions } = useAuth();
  const [view, setView] = useState(false);
  const [editEmployee, setEditEmployee] = useState(false);
  const [index,setIndex] = useState(0);
  const [count,setCount] = useState('');
  useEffect(() => {
    fetch("/api/dashboard/all-employee",{
      method:'POST',
      body:JSON.stringify({index:index,limit:10})
    })
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {  
        setCount(data?.count);      
        setUsers(data?.data);
      });
  }, [editEmployee,index]);

  const getSortBy = (e) => {
    setSortBy(e.target.value);
  };
  const getSearch = (e) => {
    setSearch(e.target.value);
  };

  const formatDate = (dateString) => {
    const monthName = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(dateString);
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    return `${day}, ${monthName[month]} ${year}`;
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
  const getIndex = (e)=> {
    setIndex(e)
  }
  return (
    <>
      {userPermissions && userPermissions?.includes("view-employee") && (
        <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full">
          <Wrapper className="flex justify-between items-center">
            <H2>Employees</H2>
            <DropDown
              items={userType}
              setData={getSortBy}
              value={sortby}
              placeholder="Sort By"
              name="Sort By"
              className="!flex-none"
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
                users.map((user, index) => (
                  <Wrapper
                    key={index}
                    className={` flex items-center ${
                      index > 0 ? "border-t border-light-500" : ""
                    }`}
                  >
                    <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark">
                      {index + 1}
                    </Wrapper>
                    <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark">
                      {user.name}
                    </Wrapper>
                    <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark">
                      {user.department}
                    </Wrapper>
                    <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark">
                      {user.designation}
                    </Wrapper>
                    <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark">
                      {formatDate(user.incrementDate)}
                    </Wrapper>
                    <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark flex gap-[2px]">
                      <span
                        onClick={() => editEmployeeModal(index)}
                        className="rounded-full w-[30px] h-[30px] bg-accent flex justify-center items-center cursor-pointer hover:scale-110"
                      >
                        <IconEdit size="16px" color="fill-white" />
                      </span>
                      <span
                        onClick={() => viewModal(index)}
                        className="rounded-full w-[30px] h-[30px] bg-[#219653] flex justify-center items-center cursor-pointer hover:scale-110"
                      >
                        <IconView size="16px" color="fill-white" />
                      </span>
                    </Wrapper>
                  </Wrapper>
                ))}
            </Wrapper>
            {count > 0 && (
        <div></div>
      )}
      <Pagination count={5} getIndex={getIndex} index={index} />
          </Wrapper>
        </Wrapper>
      )}

      {view && (
        <Modal
          opened={view}
          hideModal={closeViewModal}
          heading={"Employee - " + user?.name}
        >
          <Wrapper className="bg-white rounded-[10px] p-5 max-w-[895px] w-full m-auto">
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Name</Text>
              <Text> {user?.name}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Email Address</Text>
              <Text> {user?.email}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Join Date</Text>
              <Text> {formatDate(user?.joinDate)}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Role</Text>
              <Text> {user?.role}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Department</Text>
              <Text> {user?.department}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> DOB</Text>
              <Text> {user?.DOB}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Gender</Text>
              <Text> {user?.gender}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> Increment Date</Text>
              <Text> {user?.incrementDate}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400"> User Type</Text>
              <Text> {user?.userType}</Text>
            </Wrapper>
            <Wrapper className="flex justify-between py-[10px] border-b border-light-500">
              <Text className="!text-light-400">Status</Text>
              <Text> {user?.status || 'active'}</Text>
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
          <Wrapper className='max-w-[510px] m-auto'>
          <EditEmployee user={user} closePopup={closeEditModal} />
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default AllEmployees;
