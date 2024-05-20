"use client";

import useAuth from "@/app/contexts/Auth/auth";
import { useEffect, useState } from "react";
import Container from "../../Ui/DashboardContainer/Container";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import H1 from "../../Ui/H1/H1";
import H3 from "../../Ui/H3/H3";

const Employees = () => {
  const { users, userData, userPermissions } = useAuth();
  const [total, setTotal] = useState("");
  const [male, setMale] = useState("");
  const [female, setFemale] = useState("");

  useEffect(() => {
    const maleCount = users?.filter((item) => {
      return item?.gender === "male";
    });
    const femaleCount = users?.filter((item) => {
      return item?.gender === "female";
    });
    setTotal(users.length);
    setMale(maleCount.length);
    setFemale(femaleCount.length);
  }, [users]);
  return (
    <>
    {userPermissions && userPermissions?.includes("view-employee") && (
    <Container heading={`Welcome, ${userData?.name?.split(" ")[0]}`}>
      <Wrapper className="flex justify-between gap-[15px]">
        <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center">
          <H1 className="text-light-500 text-[64px] leading-none">{total}</H1>
          <H3 className="text-center text-light-400 mt-[5px]">
            Total Employees
          </H3>
        </Wrapper>
        <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center">
          <H1 className="text-light-500 text-[64px] leading-none">{male}</H1>
          <H3 className="text-center text-light-400 mt-[5px]">
            Male Employees
          </H3>
        </Wrapper>
        <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center">
          <H1 className="text-light-500 text-[64px] leading-none">{female}</H1>
          <H3 className="text-center text-light-400 mt-[5px]">
            Female Employees
          </H3>
        </Wrapper>
      </Wrapper>
    </Container>
    )}
    </>
  );
};

export default Employees;
