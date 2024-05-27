"use client";

import { useEffect, useState } from "react";
import Container from "../../Ui/DashboardContainer/Container";
import H1 from "../../Ui/H1/H1";
import H3 from "../../Ui/H3/H3";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import useAuth from "@/app/contexts/Auth/auth";
import IconInfo from "../../Icons/IconInfo";
import Text from "../../Ui/Text/Text";
import H2 from "../../Ui/H2/H2";
import DropDown from "../../Form/DropDown/select";
import IconSort from "../../Icons/IconSort";
import { duration, gender, leaveSort, userType } from "@/app/data/default";
import { formatDate } from "@/app/utils/DateFormat";
import IconGender from "../../Icons/IconGender";
import IconClock from "../../Icons/IconClock";

const Leaves = ({heading}) => {
  const [formData, setFromData] = useState({});
  const { userPermissions, leaves, userData } = useAuth();
  const [user, setUser] = useState("");
  const [previousLeaves, setPreviousLeaves] = useState("");
  const addItemForm = (e) => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    setUser(leaves);
    fetch(`/api/dashboard/leaves?email=${userData?.email}`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res?.leaves?.length > 0) {
          setPreviousLeaves(res.leaves);
        }
      });
  }, []);

  return (
    <>
      {userPermissions && userPermissions?.includes("balance-leaves") && (
      <Container heading={heading}>
        <Wrapper className="flex justify-between gap-[15px]">
          <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center">
            <H1 className="text-light-500 text-[64px] leading-none">
              {user?.balancedLeaves || 12}
            </H1>
            <H3 className="text-center text-light-400 mt-[5px]">
              Balance Leaves
            </H3>
          </Wrapper>
          <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center">
            <H1 className="text-light-500 text-[64px] leading-none">
              {user?.totalLeaveTaken || 0}
            </H1>
            <H3 className="text-center text-light-400 mt-[5px]">
              Total Leaves Taken
            </H3>
          </Wrapper>
          <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center">
            <H1 className="text-light-500 text-[64px] leading-none">
              {user?.balancedSandwichLeaves || 4}
            </H1>
            <H3 className="text-center text-light-400 mt-[5px] flex gap-2 items-center">
              Balance Sandwich Leaves{" "}
              <span className="relative cursor-pointer group">
                <IconInfo size="18px" color="fill-dark-blue" />
                <Text className="absolute left-full top-1/2 translate-y-[-40%] bg-white border border-blue rounded-lg text-xs p-3 w-60 text-left opacity-0  invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-[-50%]">
                  Employees are granted four extra leave days annually, one per
                  quarter, strategically aligned with weekends or public
                  holidays.
                </Text>
              </span>
            </H3>
          </Wrapper>
          <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center">
            <H1 className="text-light-500 text-[64px] leading-none">
              {user?.balancedSandwichLeavesTaken || 0}
            </H1>
            <H3 className="text-center text-light-400 mt-[5px]">
              Sandwich Leaves Taken
            </H3>
          </Wrapper>
        </Wrapper>
        <Wrapper className="flex justify-between gap-[15px] mt-[15px]">
          <Wrapper className="bg-white rounded-[10px] p-5 w-full">
            <Wrapper className=" flex flex-col gap-[15px] ">
              <Wrapper className="flex justify-between items-center">
                <H2>Leave Record</H2>
                <DropDown
                  items={leaveSort}
                  placeholder="Sort By"
                  name="Sort By"
                  className="!flex-none max-w-[195px] w-full"
                >
                  <IconSort size="24px" color="fill-light-400" />
                </DropDown>
              </Wrapper>
            </Wrapper>
            <Wrapper className="mt-[15px] flex flex-col gap-[15px]">
              {previousLeaves &&
                previousLeaves?.map((item, index) => {
                  return <LeaveItem item={item} key={index} />;
                })}
            </Wrapper>
          </Wrapper>
          <Wrapper className="bg-white rounded-[10px] p-5 w-full max-w-[600px]">
          <H2>Request For Leave</H2>
          <form className="mt-[15px]">
          <DropDown
                  items={duration}
                  required={true}
                  setData={addItemForm}
                  value={formData?.duration || ""}
                  name="duration"
                  placeholder={"Duration"}
                >
                  <IconClock size="24px" color="stroke-light-400" />
                </DropDown>
          </form>
          </Wrapper>
        </Wrapper>
      </Container>
      )}
    </>
  );
};

export default Leaves;

const LeaveItem = ({ item }) => {
  return (
    <>
      <Wrapper className="border border-light-500">
        <Wrapper className="p-[10px]">
          <span className="text-light-400 block mb-1 font-semibold">
            Duration: {item?.duration}
          </span>
          <H3>{item?.subject}</H3>
          <div
            className="mt-[5px] text-sm font-medium font-poppins text-text-dark"
            dangerouslySetInnerHTML={{
              __html: item?.reason.substring(0, 200) + "...",
            }}
          ></div>
          <Wrapper className="mt-2 pt-2 border-t border-light-500 flex items-center justify-between">
            <Text>{formatDate(item?.updatedAt)}</Text>
            <Wrapper className="flex items-center gap-2 text-sm font-medium font-poppins">
              Status:
              <Wrapper
                className={`capitalize text-sm font-medium font-poppins text-white py-[5px] rounded-3xl px-[30px] ${
                  item?.status === "pending" ? "bg-dark-blue" : ""
                } ${item?.status === "approved" ? "bg-accent" : ""} `}
              >
                {item?.status}
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </>
  );
};
