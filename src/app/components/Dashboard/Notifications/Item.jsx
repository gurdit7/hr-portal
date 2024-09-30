"use client";
import { useState } from "react";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import Text from "../../Ui/Text/Text";
import Link from "next/link";
import useAuth from "@/app/contexts/Auth/auth";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import { formatDate } from "@/app/utils/DateFormat";
import IconDelete from "../../Icons/IconDelete";

export const toHTML = (ref, content, limit) => {
  if (ref.current) {
    ref.current.innerHTML = content.substring(0, limit);
  }
};

const Item = ({ item }) => {
  const { userData } = useAuth();
  const { fetchNotifications, userPermissions, fetchIndividualNotifications } =
    useDashboard();
  const click = async (id) => {
    try {
      const viewedStatus = item?.views.map((mail) => {
        if (mail?.mail === userData?.email && mail?.trashed) {
          return { mail: mail?.mail, status: true, trashed: true };
        } else if (mail?.mail === userData?.email && !mail?.trashed) {
          return { mail: mail?.mail, status: true, trashed: false };
        } else {
          return mail;
        }
      });
      const response = await fetch("/api/dashboard/notifications", {
        method: "PUT",
        body: JSON.stringify({
          id: id,
          key: userData?._id,
          viewed: viewedStatus,
        }),
      });
      const result = await response.json();
      if (result?.matchedCount > 0) {
        if (
          userPermissions &&
          userPermissions.includes("view-users-notifications")
        ) {
          fetchNotifications(userData?._id, userData?.email);
        }
        if (userPermissions && userPermissions.includes("user-notifications")) {
          fetchIndividualNotifications(userData?._id, userData?.email);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const trashed = async (id) => {
    try {
      const viewedStatus = item?.views.map((mail) => {
        if (mail?.mail === userData?.email) {
          return { mail: mail?.mail, status: true, trashed: true };
        } else {
          return mail;
        }
      });
      const response = await fetch("/api/dashboard/notifications", {
        method: "PUT",
        body: JSON.stringify({
          id: id,
          key: userData?._id,
          viewed: viewedStatus,
        }),
      });
      const result = await response.json();
      if (result?.matchedCount > 0) {
        if (
          userPermissions &&
          userPermissions.includes("view-users-notifications")
        ) {
          fetchNotifications(userData?._id, userData?.email);
        }
        if (userPermissions && userPermissions.includes("user-notifications")) {
          fetchIndividualNotifications(userData?._id, userData?.email);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {item && !item?.trash && (
        <Wrapper
          className={`border rounded-lg  relative flex justify-between ${
            !item?.viewedStatus
              ? "border-l-4 border-green-600 dark:border-accent"
              : " border-light-500 dark:border-gray-600"
          }`}
        >
          <div
            onClick={() => click(item?.mainId)}
            className="p-[10px] relative flex items-center gap-3 justify-between overflow-hidden group w-full"
          >
            <div className="flex justify-center items-center gap-2">
              <Wrapper className="w-10 h-10 min-w-10 border rounded-full bg-accent flex justify-center items-center text-white font-semibold text-xl">
                {item.name.slice(0, 1)}
              </Wrapper>
              <Wrapper className="flex flex-col gap-0">
                {item?.type === "leaveRequest" && (
                  <Text>{item.name} is requested for leave.</Text>
                )}
                {item?.type === "info" && <Text>{item?.subject}</Text>}
                {item?.type === "document" && (
                  <Text>{item.name} is requested for leave.</Text>
                )}
                {(item?.type === "indiNotification" ||
                  item?.type === "leaveCanceled") && (
                  <Text>{item.subject}</Text>
                )}

                {item?.type === "appraisalForm" && (
                  <Text>{item.name} is requested for appraisal.</Text>
                )}
                {item?.type === "documentRequest" && (
                  <Text>{item.name} is requested for document.</Text>
                )}
                {item?.link && (
                  <Link
                    href={item?.link}
                    className="opacity-0 absolute top-0 left-0 w-full h-full"
                  ></Link>
                )}
                <Text className="!text-xs !text-gray-400">
                  {formatDate(item?.updatedAt)}
                </Text>
              </Wrapper>
            </div>
          </div>
          <div
            onClick={() => trashed(item?.mainId)}
            className="cursor-pointer  w-[60px] flex justify-center items-center group"
          >
            <span className="pointer-events-none group-hover:scale-95">
              <IconDelete color="fill-red-700 dark:fill-white" size="24px" />
            </span>
          </div>
        </Wrapper>
      )}
    </>
  );
};

export default Item;
