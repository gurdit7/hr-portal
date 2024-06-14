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
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";

const ItemRecentNotifications = () => {
  const { userData } = useAuth();
  const { userPermissions, userNotifications, fetchNotifications } =
    useDashboard();
  const [emailID, setEmail] = useState("");
  const [name, setName] = useState("");
  const [allNotification, setAllNotification] = useState("");
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(0);
  const [sortby, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const limit = 10;
  useEffect(() => {
    setEmail(userData?.email || "");
    setName(userData?.name || "");
  }, [userData]);

  useEffect(() => {
    if (userNotifications) {
      setCount(Math.ceil(userNotifications.length / limit));
      setAllNotification(
        userNotifications.slice(start * limit, (start + 1) * limit)
      );
    }
  }, [userNotifications]);
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSortByChange = (e) => setSortBy(e.target.value);
  const handlePageChange = (e) => {
    setStart(e);
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
 {allNotification &&
              allNotification.map((item, i) => (
                 <Item item={item} key={i}/> 
              ))}
      {count > 1 && (
        <Pagination count={count} getIndex={handlePageChange} index={start} />
      )}
      {count === 0 && (
        <Text className="text-center my-4">
          {defaultTheme?.notificationsNoRecord}
        </Text>
      )}
    </>
  );
};

export default ItemRecentNotifications;
