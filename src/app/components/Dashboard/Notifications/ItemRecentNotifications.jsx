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

const ItemRecentNotifications = ({heading, userNotifications}) => {  
  const [allNotification, setAllNotification] = useState("");
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(0);
  const limit = 10;
  useEffect(() => {
    const all =  userNotifications.filter((item) => {
      return !item?.trash ? item : '';
    });
    if (userNotifications) {
      setCount(Math.ceil(all.length / limit));
      setAllNotification(
        all.slice(start * limit, (start + 1) * limit)
      );
    }
  }, [start,userNotifications]);
  const handlePageChange = (e) => {
    setStart(e);
  };
  return (
    <>
      <Wrapper className="flex justify-between items-center">
        {count > 0 && (
          <>
            <H2>{heading}</H2>
       
          </>
        )}
      </Wrapper>
      {allNotification &&
        allNotification.map((item, i) => <Item item={item} key={i} />)}
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
