"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import ProfileImage from "@/app/components/Dashboard/Profile/Image/ProfileImage";
import Text from "@/app/components/Ui/Text/Text";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import SkeletonLoader from "@/app/components/Ui/skeletonLoader/skeletonLoader";

import IconDashboard from "@/app/components/Icons/IconDashboard";
import IconProfile from "@/app/components/Icons/IconProfile";
import IconNotification from "@/app/components/Icons/IconNotification";
import IconEmployee from "@/app/components/Icons/IconEmployee";
import IconLeave from "@/app/components/Icons/IconLeave";
import IconSalary from "@/app/components/Icons/IconSalary";
import IconCalander from "@/app/components/Icons/IconCalander";

import useAuth from "@/app/contexts/Auth/auth";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";

const Sidebar = () => {
  const { sidebarCollapse } = useThemeConfig();
  const { userLoggedIn, userPermissions, userData } = useAuth();
  const path = usePathname();
  const menuItems = [
    { href: "/", label: "Dashboard", icon: IconDashboard, isActive: path === "/" },
    { href: "/dashboard/profile", label: "Profile", icon: IconProfile, isActive: path === "/dashboard/profile" },
    { href: "/dashboard/leaves", label: "Leaves Management", icon: IconLeave, isActive: path.includes("leaves") },
    { 
      href: "/dashboard/salary", 
      label: "Salary", 
      icon: IconSalary, 
      isActive: path === "/dashboard/salary" || path.includes("/appraisal/") || path === "/dashboard/create-salary"
    },
    { 
      href: "/dashboard/employees", 
      label: "Employees", 
      icon: IconEmployee, 
      isActive: path === "/dashboard/employees", 
      requiresPermission: "view-employee" 
    },
    { href: "/dashboard/notifications", label: "Notifications", icon: IconNotification, isActive: path === "/dashboard/notifications" },
    { href: "/dashboard/holidays", label: "Holidays", icon: IconCalander, isActive: path === "/dashboard/holidays" }
  ];
  return (
    <div>
    {userLoggedIn && (
    <aside
      className={`fixed h-full w-full left-0 top-0 transition-all duration-200 bg-dark-blue py-5 ${
        sidebarCollapse ? "max-w-[100px]" : "max-w-[300px]"
      }`}
    >
      <Wrapper>
        {userLoggedIn ? (
          <>
            <Text
              className={`text-center font-poppins text-white mb-4 transition-all duration-200 ${
                sidebarCollapse ? "text-sm font-normal" : "!text-2xl !font-bold"
              }`}
            >
              HR PORTAL
            </Text>
            <ProfileImage size={sidebarCollapse ? "46" : "100"} />
            <Text
              className={`font-poppins font-semibold text-center text-white mt-2 ${
                sidebarCollapse ? "text-sm font-normal" : "!text-lg"
              }`}
            >
              {userData?.name}
            </Text>
          </>
        ) : (
          <LoaderSkeleton sidebarCollapse={sidebarCollapse} />
        )}
        <Wrapper className={`mt-9 ${sidebarCollapse ? "pl-2" : "pl-12"}`}>
          <ul className="list-none p-0 mt-0">
            {menuItems.map(
              ({ href, label, icon: Icon, isActive, requiresPermission }) =>
                (!requiresPermission || userPermissions && userPermissions?.includes(requiresPermission)) && (
                  <DashboardLink
                    key={href}
                    href={href}
                    label={label}
                    isActive={isActive}
                    sidebarCollapse={sidebarCollapse}
                  >
                    <Icon size="24px" color={isActive ? "fill-dark-blue" : "fill-white"} />
                  </DashboardLink>
                )
            )}
          </ul>
        </Wrapper>
      </Wrapper>
    </aside>
  )}
  {!userLoggedIn && !path.includes('account')  && (
      <aside
      className={`fixed h-full w-full left-0 top-0 transition-all duration-200 bg-dark-blue py-5 ${
        sidebarCollapse ? "max-w-[100px]" : "max-w-[300px]"
      }`}
    >
  <LoaderSkeleton sidebarCollapse={sidebarCollapse} />
  </aside>)}
  </div>
  );
};

const DashboardLink = ({ href, label, children, isActive, sidebarCollapse }) => (
  <li>
    <Link
      href={href}
      className={`${
        isActive ? "text-dark-blue bg-bg rounded-l-[60px]" : "text-white"
      } flex items-center text-sm font-semibold uppercase gap-1 px-6 py-3`}
    >
      {children}
      {!sidebarCollapse && label}
    </Link>
  </li>
);

const LoaderSkeleton = ({ sidebarCollapse }) => (
  <>
    <SkeletonLoader className="!h-8 max-w-[150px] mx-auto rounded-lg mb-4" />
    <SkeletonLoader className="!h-[112px] w-[112px] max-w-[112px] mx-auto rounded-full mb-4" />
    <SkeletonLoader className="!h-7 max-w-[150px] mx-auto rounded-lg mt-2" />
  </>
);

export default Sidebar;
