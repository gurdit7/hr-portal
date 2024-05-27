"use client";

import useAuth from "@/app/contexts/Auth/auth";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import Text from "../../Ui/Text/Text";
import H3 from "../../Ui/H3/H3";
import { formatDate } from "@/app/utils/DateFormat";
import { useEffect, useState } from "react";
import Pagination from "../../Ui/Pagination/Pagination";
import H2 from "../../Ui/H2/H2";
import DropDown from "../../Form/DropDown/select";
import Input from "../../Form/Input/Input";
import IconSort from "../../Icons/IconSort";
import { userType } from "@/app/data/default";
import IconSearch from "../../Icons/IconSearch";

const ItemRecentNotifications = () => {
  const { userData } = useAuth();
  const [emailID, setEmail] = useState(false);
  const [name, setName] = useState(false);
  const [userNotifications, setUserNotifications] = useState('');
  const [userNotificationsLength, setUserNotificationsLength] = useState(0);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(0);
  const [sortby, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const getIndex = (e) => {
    setStart(e);
  };
  const getSearch = (e) => {
    setSearch(e.target.value);
  }
  const getSortBy = (e) => {
    setSortBy(e.target.value);
  }
  useEffect(()=>{
    setCount(Math.ceil(userNotificationsLength/limit));
  },[userNotificationsLength,limit])
  useEffect(()=>{
    setEmail(userData?.email);
    setName(userData?.name);
  },[userData])
  useEffect(()=>{
    fetch(`/api/dashboard/notifications?all=true&limit=${limit}&start=${start}`)
    .then(function (res) {
      return res.json();
    })
    .then(async function (data) {
      setUserNotifications(data?.data);
      setUserNotificationsLength(data?.length);
    });  
  },[limit,start])


  return (
    <>
       <Wrapper className="flex justify-between items-center">
            <H2>Recent Notification</H2>
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
    <div className="flex flex-col gap-[15px]">
      {userNotifications &&
        userNotifications.map((item, index) => {
          return <Item item={item} key={index} emailID={emailID} name={name} />;
        })}
    </div>
    {count > 1 && (
    <Pagination
    count={count} 
    getIndex={getIndex}   
    index={start}
    />)}
    </>
  );
};

export default ItemRecentNotifications;

export const Item = ({ item }) => {  
  return (
    <>
  
    <Wrapper className="border border-light-500">
      <Wrapper className="p-[10px]">
        {item?.document && <Text className="!text-light-400">
          Document Requested
        </Text>}
        <H3>{item?.subject || item?.document} {item?.ExpectedSalary ? 'Appraisal Request' : ''}</H3>
      {item?.description && (  <div
          className="mt-[5px] text-sm font-medium font-poppins text-text-dark"
          dangerouslySetInnerHTML={{
            __html: item?.description?.substring(0, 350) + "...",
          }}
        ></div>)}


          <Wrapper className='flex justify-between items-center border-t border-light-500 pt-[5px] mt-[5px]'
          >  <Text>
           {item?.name && ('Applied By: ' + item?.name)}
          </Text>
            <Text>
            {formatDate(item?.updatedAt)}
            </Text>
          </Wrapper>
 
      </Wrapper>
    </Wrapper>
    </>
  );
};
