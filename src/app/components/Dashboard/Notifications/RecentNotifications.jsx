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
import Modal from "../../Ui/Modal/Modal";
import Text from "../../Ui/Text/Text";
import EditEmployee from "../../Form/EditEmployee/EditEmployee";
import Pagination from "../../Ui/Pagination/Pagination";
import ItemRecentNotifications from "./ItemRecentNotifications";

const RecentNotifications = () => {
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
  useEffect(() => {
    fetch("/api/dashboard/all-employee", {
      method: "POST",
      body: JSON.stringify({ index: index, limit: 10 }),
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
        setAddEmployee(false);
      });
  }, [editEmployee, index, addEmployee]);

  const getSortBy = (e) => {
    setSortBy(e.target.value);
    fetch("/api/dashboard/filter-employee", {
      method: "POST",
      body: JSON.stringify({
        userType: e.target.value,
        index: index,
        sort: true,
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
        sort: false,
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

  const closeEditModal = (e) => {
    setEditEmployee(e);
  };
  const getIndex = (e) => {
    setIndex(e);
  };
  return (
    <>
      {userPermissions &&
        userPermissions?.includes("view-users-notifications") && (
          <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full">
            <ItemRecentNotifications />
            <Wrapper>
              {error && (
                <Text className="text-center my-4">No Record Found.</Text>
              )}
            </Wrapper>
          </Wrapper>
        )}
      {userPermissions && userPermissions?.includes("user-notifications") && (
        <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full">
          <ItemRecentNotifications />
          <Wrapper>
            {error && (
              <Text className="text-center my-4">No Record Found.</Text>
            )}
          </Wrapper>
        </Wrapper>
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

export default RecentNotifications;
