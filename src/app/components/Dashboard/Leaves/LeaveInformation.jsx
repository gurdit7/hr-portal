"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import H2 from "../../Ui/H2/H2";
import { toHTML } from "../Notifications/Item";
import Text from "../../Ui/Text/Text";
import Badge from "../../Ui/Badge/Badge";
import Link from "next/link";
import ApproveLeave from "./ApproveLeave";
import useAuth from "@/app/contexts/Auth/auth";
import { formatDate } from "@/app/utils/DateFormat";

const LeaveInformation = () => {
  const { userPermissions } = useAuth();
  const path = usePathname();
  const id = path.replace("/dashboard/leaves/", "");
  const [user, setUser] = useState("");
  const [leaves, setLeaves] = useState("");
  const [value, setValue] = useState(false);
  const paraRef = useRef();
  useEffect(() => {
    fetch(`/api/dashboard/leaves?id=${id}`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {    
        setUser(res?.leaves);
        setLeaves(res?.user);
      });
  }, [id, value]);
  return (
    <>
      {user && (
        <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full relative">
          <H2>Subject: {user?.subject}</H2>
          {user?.description && (
            <div
              className="mt-[5px] text-sm font-medium font-poppins text-text-dark"
              ref={paraRef}
            >
              {toHTML(paraRef, user?.description, user?.description.length)}
            </div>
          )}
          <Wrapper>
            {user?.name && (
              <Wrapper className="flex justify-between items-center p-2 border-light-500 border-y min-h-[50px]">
                <Text className="!text-light-400">Applied by:</Text>
                <Text>{user?.name}</Text>
              </Wrapper>
            )}
            {user?.status && (
              <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Status:</Text>
                <Badge status={user?.status} />
              </Wrapper>
            )}
            {user?.duration && (
              <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Duration:</Text>
                <Text>
                  {user?.duration !== "Other"
                    ? `${user?.duration} on ${formatDate(user?.durationDate)}`
                    : ""}
                  {user?.duration === "Other"
                    ? `From: ${user?.from} - To: ${user?.to}`
                    : ""}
                </Text>
              </Wrapper>
            )}
            {user?.attachment && (
              <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Attachment:</Text>
                <Link
                  href={user?.attachment}
                  target="_blank"
                  className="text-xs py-2 px-5 rounded-md text-white uppercase tracking-normal bg-red-400"
                >
                  Check Attachment
                </Link>
              </Wrapper>
            )}
            {userPermissions &&
              user?.status === "pending" &&
              userPermissions?.includes("approve-decline-leaves") && (
                <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
                  <Text className="!text-light-400">Take Action:</Text>
                  <ApproveLeave
                    id={id} 
                    setValue={setValue}
                    user={user}
                    leaves={leaves}
                  />
                </Wrapper>
              )}
            {user?.reason && (
              <Wrapper className="flex justify-between items-center p-2 max-w-1/2 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Comment</Text>
                <Text className="">{user?.reason}</Text>
              </Wrapper>
            )}
          </Wrapper>
        </Wrapper>
      )}
    </>
  );
};

export default LeaveInformation;
