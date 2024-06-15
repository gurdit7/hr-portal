"use client";

import useAuth from "@/app/contexts/Auth/auth";
import { useEffect, useState } from "react";
import Container from "../../Ui/DashboardContainer/Container";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import H1 from "../../Ui/H1/H1";
import H3 from "../../Ui/H3/H3";
import BalancedLeaves from "../Leaves/BalancedLeaves";
import LeavesRecord from "../Leaves/LeavesRecord";
import AllHolidays from "../Holidays/AllHolidays";
import H2 from "../../Ui/H2/H2";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import RecentNotifications from "../Notifications/RecentNotifications";
const HomePage = () => {
  const { userData } = useAuth();
  const { allEmployeesData, userPermissions } = useDashboard();
  const [total, setTotal] = useState(0);
  const [male, setMale] = useState(0);
  const [female, setFemale] = useState(0);
  const { setBreadcrumbs } = useThemeConfig();
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const breadcrumbs = [];
    setBreadcrumbs(breadcrumbs);
  }, []);
  useEffect(() => {
    if (allEmployeesData.length > 0) {
      const maleCount = allEmployeesData?.filter((item) => {
        return item?.gender === "male";
      });
      const femaleCount = allEmployeesData?.filter((item) => {
        return item?.gender === "female";
      });
      setTotal(allEmployeesData.length);
      setMale(maleCount.length);
      setFemale(femaleCount.length);
    }
  }, [allEmployeesData]);
  return (
    <>
      {userPermissions && userPermissions?.includes("write-employees") && (
        <Container heading={`Welcome, ${userData?.name?.split(" ")[0]}`}>
          <Wrapper className="flex justify-between gap-[15px]">
            <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center">
              <H1 className="text-light-500 text-[64px] leading-none">
                {total}
              </H1>
              <H3 className="text-center text-light-400 mt-[5px]">
                Total Employees
              </H3>
            </Wrapper>
            <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center">
              <H1 className="text-light-500 text-[64px] leading-none">
                {male}
              </H1>
              <H3 className="text-center text-light-400 mt-[5px]">
                Male Employees
              </H3>
            </Wrapper>
            <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center">
              <H1 className="text-light-500 text-[64px] leading-none">
                {female}
              </H1>
              <H3 className="text-center text-light-400 mt-[5px]">
                Female Employees
              </H3>
            </Wrapper>
          </Wrapper>
        </Container>
      )}
      {userPermissions && userPermissions?.includes("balance-leaves") && !userPermissions?.includes("write-employees") && (
        <Container heading={`Welcome, ${userData?.name}`}>
         <BalancedLeaves user={userData} />
          <Wrapper className="flex justify-between gap-[15px] mt-[15px] items-start">
            <RecentNotifications />
            <Wrapper className="max-w-[600px] w-full bg-white rounded-[10px] p-5">
              <H2 className="mb-[5px]">Holidays</H2>
              <AllHolidays />
            </Wrapper>
          </Wrapper>
        </Container>
      )}
      {!userPermissions && (
        <Container>
          <Wrapper className="flex justify-between gap-[15px]">
            <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center animate-pulse">
              <H1 className="text-light-500 text-[64px] leading-none opacity-0">
                {total || 0}
              </H1>
              <H3 className="text-center text-light-400 mt-[5px] opacity-0">
                Total Employees
              </H3>
            </Wrapper>
            <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center animate-pulse">
              <H1 className="text-light-500 text-[64px] leading-none opacity-0">
                {male || 0}
              </H1>
              <H3 className="text-center text-light-400 mt-[5px] opacity-0">
                Male Employees
              </H3>
            </Wrapper>
            <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center animate-pulse">
              <H1 className="text-light-500 text-[64px] leading-none opacity-0">
                {female || 0}
              </H1>
              <H3 className="text-center text-light-400 mt-[5px] opacity-0">
                Female Employees
              </H3>
            </Wrapper>
          </Wrapper>
        </Container>
      )}
    </>
  );
};

export default HomePage;
