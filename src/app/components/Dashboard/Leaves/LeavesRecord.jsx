"use client";
import React, { useEffect, useState } from "react";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import DropDown from "../../Form/DropDown/select";
import { defaultTheme, leaveSort } from "@/app/data/default";
import SkeletonLoader from "../../Ui/skeletonLoader/skeletonLoader";
import useAuth from "@/app/contexts/Auth/auth";
import Text from "../../Ui/Text/Text";
import H2 from "../../Ui/H2/H2";
import IconSort from "../../Icons/IconSort";
import { LeaveItem } from "./Leaves";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import Pagination from "../../Ui/Pagination/Pagination";
import Input from "../../Form/Input/Input";
import IconSearch from "../../Icons/IconSearch";

const LeavesRecord = () => {
  const { userPermissions, individualUserLeaves, allUsersLeaves } =
    useDashboard();
  const [allLeaves, setAllLeaves] = useState([]);
  const [status, setStatus] = useState(false);
  const [error, setError] = useState(false);
  const array = [0, 1, 2, 3, 4];
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 3;
  const getSort = (e) => {
    setError(false);
    if (e.target.value !== "all") {
      if (!userPermissions?.includes("user-leaves")) {
        let filteredUsers = individualUserLeaves?.filter((user) => {
          return user.status === e.target.value;
        });
        setCount(Math.ceil(filteredUsers.length / limit));
        setAllLeaves(filteredUsers.slice(start * limit, (start + 1) * limit));
      } else {
        let filteredUsers = allUsersLeaves?.filter((user) => {
          return user.status === e.target.value;
        });
        setCount(Math.ceil(filteredUsers.length / limit));
        setAllLeaves(filteredUsers.slice(start * limit, (start + 1) * limit));
      }
    } else {
      if (!userPermissions?.includes("user-leaves")) {
        setCount(Math.ceil(individualUserLeaves?.length / limit));
        setAllLeaves(
          individualUserLeaves?.slice(start * limit, (start + 1) * limit)
        );
      } else {
        setCount(Math.ceil(allUsersLeaves?.length / limit));
        setAllLeaves(allUsersLeaves?.slice(start * limit, (start + 1) * limit));
      }
    }
  };
  const getSearch = (e) => {
    setSearch(e.target.value);
  };
  const handlePageChange = (e) => {
    setStart(e);
  };
  useEffect(() => {
    if (
      individualUserLeaves &&
      userPermissions &&
      !userPermissions?.includes("user-leaves")
    ) {
      setStatus(true);
      setCount(Math.ceil(individualUserLeaves?.length / limit));
      setAllLeaves(
        individualUserLeaves?.slice(start * limit, (start + 1) * limit)
      );
    }
  }, [individualUserLeaves, start]);
  useEffect(() => {
    if (
      allUsersLeaves &&
      userPermissions &&
      userPermissions?.includes("user-leaves")
    ) {
      if (search !== "") {
        let filteredUsers = allUsersLeaves?.filter((user) => {
          const name = user?.name.toLowerCase();
          return name.includes(search.toLowerCase());
        });
        setCount(Math.ceil(filteredUsers.length / limit));
        setAllLeaves(filteredUsers.slice(start * limit, (start + 1) * limit));
      } else {
        setStatus(true);
        setCount(Math.ceil(allUsersLeaves?.length / limit));
        setAllLeaves(allUsersLeaves?.slice(start * limit, (start + 1) * limit));
      }
    }
  }, [allUsersLeaves, start, search]);
  return (
    <Wrapper className="bg-white rounded-[10px] p-5 w-full">
      <Wrapper className="flex flex-col gap-[15px] mb-4">
        <Wrapper className="flex justify-between items-center">
          <H2>Leave Record</H2>
          <DropDown
            items={leaveSort}
            placeholder="Filter By"
            value=""
            name="Filter By"
            setData={getSort}
            className="!flex-none max-w-[210px] w-full"
          >
            <IconSort size="24px" color="fill-light-400" />
          </DropDown>
        </Wrapper>
        {userPermissions && userPermissions?.includes("user-leaves") && (
          <Wrapper>
            <Input
              type="text"
              placeholder="Search by employee name"
              value={search}
              setData={getSearch}
              name="Search"
              wrapperClassName="!flex-none"
              className="border border-light-600"
            >
              <IconSearch size="24px" color="fill-light-400" />
            </Input>
          </Wrapper>
        )}
        {userPermissions &&
          !userPermissions?.includes("user-leaves") &&
          allLeaves &&
          allLeaves?.length > 0 && (
            <>
              {allLeaves?.map((item, index) => (
                <LeaveItem item={item} key={index} index={index} />
              ))}
            </>
          )}
        {userPermissions &&
          userPermissions?.includes("user-leaves") &&
          allLeaves &&
          allLeaves?.length > 0 && (
            <>
              {allLeaves?.map((item, index) => (
                <LeaveItem item={item} key={index} index={index} />
              ))}
            </>
          )}
        {allLeaves?.length === 0 && (
          <Text className="text-center my-4">No Record Found.</Text>
        )}
        {allLeaves?.length > 0 && count > 1 && (
          <Pagination count={count} getIndex={handlePageChange} index={start} />
        )}
      </Wrapper>
      {!status &&
        array.map((index) => (
          <Wrapper key={index} className="border border-light-500 relative">
            <Wrapper className="p-3 relative">
              <SkeletonLoader className="w-full max-w-[172px] !h-5 rounded-3xl" />
              <SkeletonLoader className="w-full max-w-[50%] !h-[27px] rounded-3xl mt-1 mb-2" />
              <Wrapper className="flex flex-col gap-2 mt-2 mb-2">
                <SkeletonLoader className="!h-3 rounded-3xl  w-1/3" />
                <SkeletonLoader className="!h-3 rounded-3xl  w-1/4" />
                <SkeletonLoader className="!h-3 rounded-3xl  w-1/5" />
                <SkeletonLoader className="!h-3 rounded-3xl  w-1/6" />
              </Wrapper>
              <Wrapper className="absolute flex top-3 right-3 w-full max-w-[103px]">
                <SkeletonLoader className="!h-8 rounded-md  w-full max-w-[103px]" />
              </Wrapper>

              <Wrapper className="flex justify-between items-center border-t border-light-500 pt-[5px] mt-[5px]">
                <SkeletonLoader className="!h-3 rounded-3xl  w-full max-w-[172px]" />
                <SkeletonLoader className="!h-3 rounded-3xl  w-full max-w-[172px]" />
              </Wrapper>
            </Wrapper>
          </Wrapper>
        ))}
    </Wrapper>
  );
};

export default LeavesRecord;
