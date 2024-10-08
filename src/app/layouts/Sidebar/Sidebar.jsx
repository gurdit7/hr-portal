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
import IconCategory from "@/app/components/Icons/IconCategory";
import IconDesignation from "@/app/components/Icons/IconDesignation";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import IconCircleUser from "@/app/components/Icons/IconCircleUser";

const Sidebar = () => {
  const { sidebarCollapse } = useThemeConfig();
  const { userLoggedIn, userData } = useAuth();
  const { userPermissions } = useDashboard();
  const path = usePathname();
  const menuItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: IconDashboard,
      isActive: path === "/",
    },
    {
      href: "/dashboard/team",
      label: "My Team",
      icon: IconEmployee,
      isActive: path === "/dashboard/team",
      requiresPermission: "read-team",
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: IconProfile,
      isActive: path === "/dashboard/profile",
      requiresPermission: "read-profile",
    },
    {
      href: "/dashboard/leaves",
      label: "Leaves Management",
      icon: IconLeave,
      isActive: path.includes("leaves"),
    },
    {
      href: "/dashboard/salary",
      label: "Salary",
      icon: IconSalary,
      isActive:
        path === "/dashboard/salary" ||
        path.includes("/appraisal/") ||
        path.includes("/documents/") ||
        path === "/dashboard/create-salary",
    },
    {
      href: "/dashboard/employees",
      label: "Employees",
      icon: IconEmployee,
      isActive: path === "/dashboard/employees",
      requiresPermission: "read-employees",
    },
    {
      href: "/dashboard/notifications",
      label: "Notifications",
      icon: IconNotification,
      isActive: path === "/dashboard/notifications" || path.includes("/notifications/"),
    },
    {
      href: "/dashboard/departments",
      label: "Departments",
      icon: IconCategory,
      isActive: path === "/dashboard/departments",
      requiresPermission: "read-department",
    },
    {
      href: "/dashboard/designations",
      label: "Designations",
      icon: IconDesignation,
      isActive: path === "/dashboard/designations",
      requiresPermission: "read-designation",
    },
    {
      href: "/dashboard/roles",
      label: "Roles",
      icon: IconCircleUser,
      isActive: path === "/dashboard/roles",
      requiresPermission: "read-roles",
    },
    {
      href: "/dashboard/holidays",
      label: "Holidays",
      icon: IconCalander,
      isActive: path === "/dashboard/holidays",
      requiresPermission: "read-holidays",
    },
  ];
  return (
    <div>
      {userLoggedIn && (
        <aside
          className={`fixed max-tab:hidden h-full w-full left-0 top-0 transition-all  max-h-screen overflow-auto duration-200 bg-dark-blue py-5 dark:bg-gray-800 dark:border-r dark:border-gray-600 ${
            sidebarCollapse ? "max-w-[100px]" : "max-w-[300px] max-4xl:max-w-[200px]"
          }`}
        >
          <Wrapper>
            {userLoggedIn ? (
              <>
                <Text
                  className={`text-center font-poppins !text-white mb-4 transition-all duration-200 ${
                    sidebarCollapse
                      ? "text-sm font-normal"
                      : "!text-2xl !font-bold"
                  }`}
                >
                  HR PORTAL
                </Text>
                <Wrapper className={sidebarCollapse ? "w-[46px]  mx-auto" : "w-[100px] mx-auto"}><ProfileImage size={sidebarCollapse ? "46" : "100"} /></Wrapper>
                <Text
                  className={`font-poppins font-semibold text-center !text-white mt-2 ${
                    sidebarCollapse ? "text-sm font-normal" : "!text-lg"
                  }`}
                >
                  {userData?.name}
                </Text>
              </>
            ) : (
              <LoaderSkeleton sidebarCollapse={sidebarCollapse} />
            )}
            <Wrapper className={` mt-9 ${sidebarCollapse ? "pl-2" : "pl-12 max-4xl:pl-4 max-3xl:pl-6"}`}>
              <ul className="list-none p-0 mt-0">
                {menuItems.map(
                  ({ href, label, icon: Icon, isActive, requiresPermission }) =>
                    (!requiresPermission ||
                      (userPermissions &&
                        userPermissions?.includes(requiresPermission))) && (
                      <DashboardLink
                        key={href}
                        href={href}
                        label={label}
                        isActive={isActive}
                        sidebarCollapse={sidebarCollapse}
                      >
                        <Icon
                          size="24px"
                          color={isActive ? "fill-dark-blue" : "fill-white"}
                        />
                      </DashboardLink>
                    )
                )}
              </ul>
            </Wrapper>
          </Wrapper>
        </aside>
      )}
      {!userLoggedIn && !path.includes("account") && (
        <aside
          className={`fixed h-full w-full left-0 top-0 transition-all duration-200 bg-dark-blue py-5 ${
            sidebarCollapse ? "max-w-[100px]" : "max-w-[300px]"
          }`}
        >
          <LoaderSkeleton sidebarCollapse={sidebarCollapse} />
        </aside>
      )}
    </div>
  );
};

const DashboardLink = ({
  href,
  label,
  children,
  isActive,
  sidebarCollapse,
}) => (
  <li>
    <Link
      href={href}
      className={`${
        isActive ? "dark:text-white-blue bg-bg rounded-l-[60px]" : "text-white"
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
