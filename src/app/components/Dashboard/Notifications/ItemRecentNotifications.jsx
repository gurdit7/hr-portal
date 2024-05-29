"use client";

import useAuth from "@/app/contexts/Auth/auth";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import Text from "../../Ui/Text/Text";
import H2 from "../../Ui/H2/H2";
import DropDown from "../../Form/DropDown/select";
import Input from "../../Form/Input/Input";
import IconSort from "../../Icons/IconSort";
import { defaultTheme, userType } from "@/app/data/default";
import IconSearch from "../../Icons/IconSearch";
import Pagination from "../../Ui/Pagination/Pagination";
import Item from "./Item";
import { useEffect, useState } from "react";

const ItemRecentNotifications = () => {
  const { userData, userPermissions } = useAuth();
  const [emailID, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userNotifications, setUserNotifications] = useState([]);
  const [userNotificationsLength, setUserNotificationsLength] = useState(0);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(0);
  const [sortby, setSortBy] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setEmail(userData?.email || "");
    setName(userData?.name || "");
  }, [userData]);

  useEffect(() => {
    setCount(Math.ceil(userNotificationsLength / limit));
  }, [userNotificationsLength, limit]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const all = !userPermissions?.includes("user-notifications");
      const response = await fetch(
        `/api/dashboard/notifications?all=${all}&limit=${start * 5 + limit}&start=${start * 5}`
      );
      const data = await response.json();
      setUserNotifications(data?.data || []);
      setUserNotificationsLength(data?.length || 0);
    };

    fetchNotifications();
  }, [limit, start, userPermissions]);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSortByChange = (e) => setSortBy(e.target.value);
  const handlePageChange = (e) => {    
    setStart(e)
  };

  return (
    <>
      <Wrapper className="flex justify-between items-center">
        {count > 0 && (
          <>
            <H2>Recent Notification</H2>
            <DropDown
              items={userType}
              setData={handleSortByChange}
              value={sortby}
              placeholder="Sort By"
              name="Sort By"
              className="!flex-none max-w-[195px] w-full"
            >
              <IconSort size="24px" color="fill-light-400" />
            </DropDown>
          </>
        )}
      </Wrapper>
      {count > 0 && (
        <Input
          value={search}
          setData={handleSearchChange}
          type="text"
          placeholder="Search"
          name="Search"
          wrapperClassName="!flex-none"
          className="border border-light-600"
        >
          <IconSearch size="24px" color="fill-light-400" />
        </Input>
      )}
      <div className="flex flex-col gap-[15px]">
        {userNotifications.map((item, index) => (
          <Item key={index} item={item} emailID={emailID} name={name} />
        ))}
      </div>
      {count > 1 && <Pagination count={count} getIndex={handlePageChange} index={start} />}
      {count === 0 && (
        <Text className="text-center my-4">
          {defaultTheme?.notificationsNoRecord}
        </Text>
      )}
    </>
  );
};

export default ItemRecentNotifications;
