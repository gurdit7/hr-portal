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

const LeavesRecord = ({loader, setLoader}) => {
  const [load, setLoad] = useState(false);
  const { userPermissions, leaves, userData } = useAuth();
  const [allLeaves, setAllLeaves] = useState(false);
  const [status, setStatus] = useState(false);
  const [error, setError] = useState(false);
  const array = [0, 1, 2, 3, 4];
  const getSort = (e) => {
    setError(false);
    if (userData) {
      if (e.target.value !== "all") {
        if (userPermissions && userPermissions?.includes("user-leaves")) {
          fetch(
            `/api/dashboard/leaves?all=true&value=${e.target.value}&key=f6bb694916a535eecf64c585d4d879ad_${userData?._id}`
          )
            .then((res) => res.json())
            .then((data) => {
              setAllLeaves(data || []);
              setTimeout(() => {
                setStatus(true);
                if (data.length === 0) {
                  setError(true);
                }
              }, 500);
            });
        } else {
          fetch(
            `/api/dashboard/leaves?email=${userData?.email}&value=${e.target.value}&key=f6bb694916a535eecf64c585d4d879ad_${userData?._id}`
          )
            .then((res) => res.json())
            .then((data) => {
              setAllLeaves(data.leaves || []);
              setTimeout(() => {
                if (data.leaves.length === 0) {
                  setError(true);
                }
                setStatus(true);
              }, 500);
            });
        }
      } else {
        setLoad(true);
      }
    }
  };
  useEffect(() => {
    setLoad(false);
    if (userData) {
      if (userPermissions && userPermissions?.includes("user-leaves")) {
        fetch(
          `/api/dashboard/leaves?all=true&key=f6bb694916a535eecf64c585d4d879ad_${userData?._id}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.length === 0) {
              setError(true);
            }
            setAllLeaves(data || []);
            setLoader(false);
          });
      } else {
        fetch(
          `/api/dashboard/leaves?email=${userData?.email}&key=f6bb694916a535eecf64c585d4d879ad_${userData?._id}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.leaves.length === 0) {
              setError(true);

            }
            setAllLeaves(data.leaves || []);
            setLoader(false);
          });
      }
    }
  }, [leaves, userData.email, load, loader]);
  return (
    <Wrapper className="bg-white rounded-[10px] p-5 w-full">
      <Wrapper className="flex flex-col gap-[15px] mb-4">
        <Wrapper className="flex justify-between items-center">
          <H2>Leave Record</H2>
          <DropDown
            items={leaveSort}
            placeholder="Sort By"
            value=""
            name="Sort By"
            setData={getSort}
            className="!flex-none max-w-[210px] w-full"
          >
            <IconSort size="24px" color="fill-light-400" />
          </DropDown>
        </Wrapper>
        {allLeaves.length > 0 ? (
          <>
            {allLeaves.map((item, index) => (
              <LeaveItem item={item} key={index} index={index} />
            ))}
          </>
        ) : (
          <>
            {error && (
              <Text className="text-center my-4">
                {defaultTheme?.leavesNoRecord}
              </Text>
            )}
          </>
        )}
      </Wrapper>
      {!allLeaves.length &&
        !status &&
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
