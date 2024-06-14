"use client";
import Container from "../../Ui/DashboardContainer/Container";
import CreateSalaryButton from "./CreateSalary/CreateSalaryButton";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import ProfileRight from "../Profile/ProfileRight/ProfileRight";
import RequestDocuments from "./RequestDocuments/RequestDocuments";
import AppraisalForm from "./AppraisalForm/AppraisalForm";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import Text from "../../Ui/Text/Text";
import Link from "next/link";
import Badge from "../../Ui/Badge/Badge";
import H3 from "../../Ui/H3/H3";
import { useRef } from "react";
import { formatDate } from "@/app/utils/DateFormat";
import H2 from "../../Ui/H2/H2";

const Salary = () => {
  const paraRef = useRef();
  const { userPermissions, appraisals } = useDashboard();
  return (
    <Container heading="Salary" className="relative">
      <CreateSalaryButton />
      <Wrapper className="flex w-full gap-[15px] relative z-[1] ">
        {userPermissions && (
          <Wrapper className="max-w-[313px] w-full bg-white rounded-[10px]">
            <ProfileRight heading="Information" button={false} />
          </Wrapper>
        )}
        {userPermissions && userPermissions?.includes("apply-documents") && (
          <RequestDocuments />
        )}
        {userPermissions && userPermissions?.includes("apply-appraisal") && (
          <AppraisalForm />
        )}
        {!userPermissions && (
          <>
            <Wrapper className="max-w-[313px] w-full bg-white rounded-[10px] min-h-[472px] animate-pulse"></Wrapper>
            <Wrapper className=" w-full bg-white rounded-[10px] min-h-[472px] animate-pulse"></Wrapper>
            <Wrapper className="w-full bg-white rounded-[10px] min-h-[472px] animate-pulse "></Wrapper>
          </>
        )}
      </Wrapper>

      {userPermissions && userPermissions?.includes("view-appraisal") && appraisals.length > 0 && (
        <Wrapper className=" w-full gap-[15px] relative z-[1] mt-4 bg-white p-5  rounded-[10px] ">
          <H2>Requested documents and appraisals.</H2>
          <Wrapper className="w-full flex flex-col gap-4 mt-3">
            {appraisals.map((item, i) => (
              <Wrapper className="border border-light-500 relative">
                <Wrapper className="p-3 relative">
                  <Text className="!text-light-400">Requested appraisal</Text>
                  <Wrapper className="absolute flex top-3 right-3">
                    <Badge status={item?.status} />
                  </Wrapper>
                  <H3>You have applied for a appraisal.</H3>                 
                  <Wrapper className="flex justify-between items-center border-t border-light-500 pt-[5px] mt-[5px]">
                    <Text>{item?.name && "Applied By: " + item?.name}</Text>
                    <Text>Updated on: {formatDate(item?.updatedAt)}</Text>
                  </Wrapper>
                </Wrapper>
                <Link
                  href={"/dashboard/appraisal/" + item._id}
                  className="opacity-0 absolute top-0 left-0 w-full h-full"
                >
                  {" "}
                </Link>
              </Wrapper>
            ))}
          </Wrapper>
        </Wrapper>
      )}
    </Container>
  );
};

export default Salary;
