"use client";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import IconNotification from "@/app/components/Icons/IconNotification";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import SkeletonLoader from "@/app/components/Ui/skeletonLoader/skeletonLoader";
import useAuth from "@/app/contexts/Auth/auth";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const { sidebarCollapse, setSidebarCollapse } = useThemeConfig();
  const [loader, setLoader] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const { userLoggedIn, setUserLoggedIn, setUserData } = useAuth();
  const { setPermissions, userNotifications, userIndividualNotifications } =
    useDashboard();
  const router = useRouter();
  const path = usePathname();
  const collapse = () => {
    setSidebarCollapse((prevState) => !prevState);
  };
  useEffect(() => {
    if (userNotifications.length > 0) {
      const notifications = userNotifications.filter((item) => {
        return item.viewedStatus === false;
      });
      setNotificationsCount(notifications.length);
    }
  }, [userNotifications]);
  useEffect(() => {
    if (userIndividualNotifications.length > 0) {
      const notifications = userIndividualNotifications.filter((item) => {
        return item.viewedStatus === false;
      });
      setNotificationsCount(notifications.length);
    }
  }, [userIndividualNotifications]);

  const logout = () => {
    fetch("/api/auth/logout", {
      method: "POST",
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setLoader(true);
        setTimeout(() => {
          if (data?.success == true) {
            setUserLoggedIn("");
            setUserData("");
            setPermissions("");
            setTimeout(() => {
              router.push("/account/login");
            }, 200);
            setLoader(false);
          }
        }, 1000);
      });
  };
  return (
    <>
      {userLoggedIn && (
        <header
          className={` flex justify-between items-center bg-white pr-6 border-b border-light-500 transition-all duration-200 ${
            sidebarCollapse ? "ml-[100px]" : "ml-[300px]"
          }`}
        >
          <Wrapper>
            <FormButton
              event={collapse}
              btnType="button"
              additionalCss={`group w-[73px] h-[73px] flex justify-center items-center border-r border-light-500 ${
                sidebarCollapse ? "bg-light-100" : ""
              }`}
              type="button"
            >
              <span className=" flex flex-col justify-center gap-[3px]">
                <span className="block w-6 h-[2px] bg-accent group-hover:w-6  "></span>
                <span
                  className={`block  h-[2px] bg-accent group-hover:w-6 transition-all duration-200 ${
                    sidebarCollapse ? "w-6" : "w-[20px]"
                  }`}
                ></span>
                <span
                  className={`block  h-[2px] bg-accent group-hover:w-6 transition-all duration-200 ${
                    sidebarCollapse ? "w-6" : "w-[16px]"
                  } `}
                ></span>
              </span>
            </FormButton>
          </Wrapper>
          <Wrapper className="py-[13px] flex items-centers  gap-[10px]">
            <Link
              href="/dashboard/notifications"
              className="flex justify-center items-center relative"
            >
              <IconNotification size="24px" color="fill-accent" />
              {notificationsCount > 0 && (
                <Wrapper className="text-[8px] absolute top-[7px] -right-[3px] min-w-4 min-h-4 rounded-full bg-dark text-white font-medium text-nowrap items-center flex justify-center">
                  {notificationsCount}
                  {notificationsCount > 99 && "+"}
                </Wrapper>
              )}
            </Link>
            <FormButton
              btnType="outlined"
              label="Logout"
              type="button"
              event={logout}
            />
          </Wrapper>
        </header>
      )}
      {!userLoggedIn && !path.includes("account") && (
        <Wrapper className="ml-[300px]  bg-white  h-[74px] flex justify-between pr-6 items-center gap-[10px]">
          <Wrapper className="items-center !h-[73px] !w-[73px] flex justify-center">
            <SkeletonLoader className="!h-[12px] !w-[24px] "></SkeletonLoader>
          </Wrapper>
          <Wrapper className="items-center gap-[10px] flex">
            <SkeletonLoader className="!h-[44px] !w-[44px] rounded-full"></SkeletonLoader>
            <SkeletonLoader className="!h-[46px] !w-[153px] rounded-lg"></SkeletonLoader>
          </Wrapper>
        </Wrapper>
      )}
      {loader && (
        <Wrapper className="fixed top-0 left-0 w-full h-full bg-white z-50"></Wrapper>
      )}
    </>
  );
};
export default Header;
