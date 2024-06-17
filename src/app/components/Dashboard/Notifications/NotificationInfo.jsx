"use client";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import H2 from "../../Ui/H2/H2";
import { toHTML } from "../Notifications/Item";
import Text from "../../Ui/Text/Text";
import Badge from "../../Ui/Badge/Badge";
import Link from "next/link";
import { formatDate } from "@/app/utils/DateFormat";
import SkeletonLoader from "../../Ui/skeletonLoader/skeletonLoader";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import useAuth from "@/app/contexts/Auth/auth";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";

const NotificationInfo = () => {
  const { setBreadcrumbs } = useThemeConfig();
  const { userData } = useAuth();
  const [notification, setNotification] = useState("");
  const path = usePathname();
  const paraRef = useRef();
  const id = path.replace("/dashboard/notifications/", "");
  useEffect(() => {
    const breadcrumbs = [
      {
        href: "/dashboard/notifications",
        label: "Notifications",
      },
      {
        href: `/dashboard/notifications/${id}`,
        label: `Notification - ${id}`,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, []);
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch(
          `/api/dashboard/notifications?id=${id}&key=${userData?._id}`
        );
        const result = await response.json();        
        setNotification(result.data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };
    if (userData) {
      fetchLeaveData();
    }
  }, [id, userData]);
  return (
    <>
      <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full relative">
        {notification?.subject && <H2>Subject: {notification?.subject}</H2>}
        {!notification?.subject && (
          <SkeletonLoader className="h-9 rounded-lg w-1/2" />
        )}
        {notification?.description && (
          <div
            className="mt-[5px] text-sm font-medium font-poppins text-text-dark"
            ref={paraRef}
          >
            {toHTML(
              paraRef,
              notification?.description,
              notification?.description.length
            )}
          </div>
        )}
        {!notification?.description && (
          <Wrapper className="flex flex-col gap-2">
            <SkeletonLoader className="h-3 rounded-3xl  w-2/3" />
            <SkeletonLoader className="h-3 rounded-3xl  w-1/2" />
            <SkeletonLoader className="h-3 rounded-3xl  w-1/3" />
            <SkeletonLoader className="h-3 rounded-3xl  w-1/4" />
            <SkeletonLoader className="h-3 rounded-3xl  w-1/5" />
            <SkeletonLoader className="h-3 rounded-3xl  w-1/6" />
          </Wrapper>
        )}
        <Wrapper>
          {notification?.name && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-y min-h-[50px]">
              <Text className="!text-light-400">Applied by:</Text>
              <Text>{notification?.name}</Text>
            </Wrapper>
          )}
          {!notification && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-y min-h-[50px]">
              <Text className="!text-light-400">Applied by:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
          {notification?.status && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Status:</Text>
              <Badge status={notification?.status} />
            </Wrapper>
          )}
          {!notification && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Status:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
          {notification?.duration && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Duration:</Text>
              <Text>
                {notification?.duration !== "Other"
                  ? `${notification?.duration} on ${formatDate(
                      notification?.durationDate
                    )}`
                  : `From: ${notification?.from} - To: ${notification?.to}`}
              </Text>
            </Wrapper>
          )}
          {!notification && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Duration:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
          {notification?.attachment && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Attachment:</Text>
              <Link
                href={notification?.attachment}
                target="_blank"
                className="text-xs py-2 px-5 rounded-md text-white uppercase tracking-normal bg-red-400"
              >
                Check Attachment
              </Link>
            </Wrapper>
          )}
          {!notification && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Attachment:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}

          {notification?.reason && (
            <Wrapper className="flex justify-between items-center p-2 max-w-1/2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Comment</Text>
              <Text className="max-w-[50%] text-right">
                {notification?.status === "canceled"
                  ? "Your leave is canceled."
                  : notification?.reason}
              </Text>
            </Wrapper>
          )}
          {!notification && (
            <Wrapper className="flex justify-between items-center p-2 max-w-1/2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Comment</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
          {notification?.updatedAt && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Applied On:</Text>
              <Text>{formatDate(notification?.updatedAt)}</Text>
            </Wrapper>
          )}
          {!notification && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Applied On:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
        </Wrapper>
      </Wrapper>
    </>
  );
};

export default NotificationInfo;
