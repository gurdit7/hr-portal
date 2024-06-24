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
  const { userPermissions, appraisals, documents, indiviualDocuments, allAppraisals } = useDashboard();
  return (
    <Container heading="Salary" className="relative">
      <CreateSalaryButton />
      <Wrapper className="flex w-full gap-[15px] relative z-[1] ">
        {userPermissions && (
          <Wrapper className="max-w-[313px] w-full bg-white dark:bg-gray-700 dark:border-gray-600 rounded-[10px]">
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
            <Wrapper className="max-w-[313px] w-full bg-white dark:bg-gray-700 dark:border-gray-600 rounded-[10px] min-h-[472px] animate-pulse"></Wrapper>
            <Wrapper className=" w-full bg-white dark:bg-gray-700 dark:border-gray-600 rounded-[10px] min-h-[472px] animate-pulse"></Wrapper>
            <Wrapper className="w-full bg-white dark:bg-gray-700 dark:border-gray-600 rounded-[10px] min-h-[472px] animate-pulse "></Wrapper>
          </>
        )}
      </Wrapper>
      <Wrapper className="grid w-full gap-[15px] relative z-[1] mt-4 grid-cols-3">
      {userPermissions && (userPermissions?.includes("view-users-documents") || userPermissions?.includes("view-team-documents")) && documents.length > 0 && (
        <Wrapper className="w-full gap-[15px] relative z-[1] mt-4 bg-white dark:bg-gray-700 dark:border-gray-600 p-5  rounded-[10px] ">
          <H2>Documents requested.</H2>
          <Wrapper className="w-full flex flex-col gap-4 mt-3">
            {documents.map((item, i) => (              
              <Wrapper key={i} className="border dark:border-gray-600 border-light-500 relative"> 
                   
                <Wrapper className="p-3 relative">
                <Wrapper className='flex justify-between items-center'>    <Text className="!text-light-400">Document request</Text>
    
                  </Wrapper>
                  <H3>{item?.name} applied for a {item?.document}.</H3>                 
                  <Wrapper className="flex justify-between items-center border-t dark:border-gray-600 border-light-500 pt-[5px] mt-[5px]">
                 
                    <Text>Updated on: {formatDate(item?.updatedAt)}</Text> <Wrapper className=" flex ">
                    <Badge status={item?.status} />
                  </Wrapper>
                  </Wrapper>
                </Wrapper>
                <Link
                  href={"/dashboard/documents/" + item._id}
                  className="opacity-0 absolute top-0 left-0 w-full h-full"
                >
                  {" "}
                </Link>
              </Wrapper>
            ))}
          </Wrapper>
        </Wrapper>
      )}
      {userPermissions && (userPermissions?.includes("view-team-appraisals") || userPermissions?.includes("view-users-appraisals")) && allAppraisals.length > 0 && (
        <Wrapper className=" w-full gap-[15px] relative z-[1] mt-4 bg-white dark:bg-gray-700 dark:border-gray-600 p-5  rounded-[10px] ">
          <H2>Appraisal requests</H2>
          <Wrapper className="w-full flex flex-col gap-4 mt-3">
            {allAppraisals.map((item, i) => (
              <Wrapper key={i} className="border dark:border-gray-600 border-light-500 relative">
                <Wrapper className="p-3 relative">
                  <Text className="!text-light-400">Appraisal requests</Text>
              
                  <H3>{item?.name} requested for a appraisal.</H3>                 
                  <Wrapper className="flex justify-between items-center border-t dark:border-gray-600 border-light-500 pt-[5px] mt-[5px]">                   
                    <Text>Updated on: {formatDate(item?.updatedAt)}</Text>
                    <Wrapper className="flex">
                    <Badge status={item?.status} />
                  </Wrapper>
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
       {userPermissions && userPermissions?.includes("view-appraisal") && appraisals.length > 0 && (
        <Wrapper className=" w-full gap-[15px] relative z-[1] mt-4 bg-white dark:bg-gray-700 dark:border-gray-600 p-5  rounded-[10px] ">
          <H2>My appraisal requests.</H2>
          <Wrapper className="w-full flex flex-col gap-4 mt-3">
            {appraisals.map((item, i) => (
              <Wrapper key={i} className="border dark:border-gray-600 border-light-500 relative">
                <Wrapper className="p-3 relative">
                  <Text className="!text-light-400">Appraisal requests</Text>
              
                  <H3>You have requested for a appraisal.</H3>                 
                  <Wrapper className="flex justify-between items-center border-t dark:border-gray-600 border-light-500 pt-[5px] mt-[5px]">                   
                    <Text>Updated on: {formatDate(item?.updatedAt)}</Text>
                    <Wrapper className="flex">
                    <Badge status={item?.status} />
                  </Wrapper>
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
        {userPermissions && userPermissions?.includes("view-documents") && indiviualDocuments.length > 0 && (
        <Wrapper className=" w-full gap-[15px] relative z-[1] mt-4 bg-white dark:bg-gray-700 dark:border-gray-600 p-5  rounded-[10px] ">
          <H2>My documents requests.</H2>
          <Wrapper className="w-full flex flex-col gap-4 mt-3">
            {indiviualDocuments.map((item, i) => (              
              <Wrapper key={i} className="border dark:border-gray-600 border-light-500 relative">                
                <Wrapper className="p-3 relative">
                  <Text className="!text-light-400">Document request</Text>
    
                  <H3>You have applied for a {item?.document}.</H3>                 
                  <Wrapper className="flex justify-between items-center border-t dark:border-gray-600 border-light-500 pt-[5px] mt-[5px]">
                    <Text>Updated on: {formatDate(item?.updatedAt)}</Text>
                    <Wrapper className="flex">
                    <Badge status={item?.status} />
                  </Wrapper>
                  </Wrapper>
                </Wrapper>
                <Link
                  href={"/dashboard/documents/" + item._id}
                  className="opacity-0 absolute top-0 left-0 w-full h-full"
                >
                  {" "}
                </Link>
              </Wrapper>
            ))}
          </Wrapper>
        </Wrapper>
      )}
      </Wrapper>
    </Container>
  );
};

export default Salary;
