"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Wrapper from "../../../Ui/Wrapper/Wrapper";
import H2 from "../../../Ui/H2/H2";
import { toHTML } from "../../Notifications/Item";
import Text from "../../../Ui/Text/Text";
import Badge from "../../../Ui/Badge/Badge";
import useAuth from "@/app/contexts/Auth/auth";
import { formatDate } from "@/app/utils/DateFormat";
import FormButton from "../../../Form/FormButton/FormButton";
import SkeletonLoader from "../../../Ui/skeletonLoader/skeletonLoader";
import Approve from "./Approve";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import AccessDenied from "@/app/components/Ui/AccessDenied/AccessDenied";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import ErrorNotification from "@/app/components/Ui/notification/loader/LoaderNotification";

const AppraisalInformation = () => {
  const [formData, setFormData] = useState({});
  const [formDataCancel, setFormDataCancel] = useState({});
  const { userLoggedIn, userData } = useAuth();
  const { userPermissions } = useDashboard();
  const path = usePathname();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState(null);
  const [value, setValue] = useState(false);
  const paraRef = useRef(null);
  const id = path.replace("/dashboard/appraisal/", "");
  const { setBreadcrumbs } = useThemeConfig();
  useEffect(() => {
    const breadcrumbs = [
      {
        href: "/dashboard/salary",
        label: "Salary",
      },
      {
        href: `/dashboard/appraisal/${id}`,
        label: `Appraisal - ${id}`,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, []);
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch(
          `/api/dashboard/appraisal?id=${id}&key=${userData?._id}`
        );
        const result = await response.json();
        setUser(result?.user);
        setLeaves(result?.leaves);

        const balancedSandwichLeaves =
          result?.leaves?.durationDay === "Friday" ||
          result?.leaves?.durationDay === "Monday"
            ? result?.user?.balancedSandwichLeaves + 1
            : result?.user?.balancedSandwichLeaves;

        setFormData({
          update: "leaves",
          email: result?.user?.email,
          key: userData._id,
          balancedLeaves: result?.user?.balancedLeaves,
          totalLeaveTaken: result?.user?.totalLeaveTaken,
          balancedSandwichLeaves,
          balancedSandwichLeavesTaken:
            result?.user?.balancedSandwichLeavesTaken,
        });

        setFormDataCancel({
          update: "cancel",
          id,
          status: "canceled",
          email: result?.user?.email,
          key: userData._id,
          balancedLeaves: result?.user?.balancedLeaves,
          balancedSandwichLeaves,
          balancedSandwichLeavesTaken:
            result?.user?.balancedSandwichLeavesTaken,
          totalLeaveTaken: result?.user?.totalLeaveTaken,
        });
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };
    if (userLoggedIn) {
      fetchLeaveData();
    }
  }, [id, value, userLoggedIn]);

  return (
    <>
      {userPermissions && userPermissions?.includes("view-appraisal") && (
        <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full relative">
          {leaves?.ExpectedSalary && (
            <H2>Expected Salary: {leaves?.ExpectedSalary}</H2>
          )}
          {!leaves?.ExpectedSalary && (
            <SkeletonLoader className="h-9 rounded-lg w-1/2" />
          )}
          {leaves?.description && (
            <div
              className="mt-[5px] text-sm font-medium font-poppins text-text-dark"
              ref={paraRef}
            >
              {toHTML(paraRef, leaves?.description, leaves?.description.length)}
            </div>
          )}
          {!leaves?.description && (
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
            {leaves?.name && (
              <Wrapper className="flex justify-between items-center p-2 border-light-500 border-y min-h-[50px]">
                <Text className="!text-light-400">Applied by:</Text>
                <Text>{leaves?.name}</Text>
              </Wrapper>
            )}
            {!leaves && (
              <Wrapper className="flex justify-between items-center p-2 border-light-500 border-y min-h-[50px]">
                <Text className="!text-light-400">Applied by:</Text>
                <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
              </Wrapper>
            )}
            {leaves?.status && (
              <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Status:</Text>
                <Badge status={leaves?.status} />
              </Wrapper>
            )}
            {!leaves && (
              <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Status:</Text>
                <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
              </Wrapper>
            )}

            {userPermissions &&
              userPermissions?.includes("write-appraisal") &&
              leaves?.status === "pending" && (
                <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
                  <Text className="!text-light-400">Take Action:</Text>
                  <Approve id={id} user={user} setValue={setValue} />
                </Wrapper>
              )}
            {leaves?.reason && (
              <Wrapper className="flex justify-between items-center p-2 max-w-1/2 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Comment</Text>
                <Text className="max-w-[50%] text-right">
                  {leaves?.status === "canceled"
                    ? "Your leave is canceled."
                    : leaves?.reason}
                </Text>
              </Wrapper>
            )}
            {leaves?.salaryOffered && (
              <Wrapper className="flex justify-between items-center p-2 max-w-1/2 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Final Salary</Text>
                <Text>{leaves?.salaryOffered}</Text>
              </Wrapper>
            )}
            {!leaves && (
              <Wrapper className="flex justify-between items-center p-2 max-w-1/2 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Comment</Text>
                <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
              </Wrapper>
            )}
            {leaves?.updatedAt && (
              <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Applied On:</Text>
                <Text>{formatDate(leaves?.updatedAt)}</Text>
              </Wrapper>
            )}
            {!leaves && (
              <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Applied On:</Text>
                <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
              </Wrapper>
            )}
          </Wrapper>
        </Wrapper>
      )}

      {userPermissions && !userPermissions?.includes("view-appraisal") && (
        <AccessDenied permission="view-appraisal" message="View appraisal" />
      )}
    </>
  );
};

export default AppraisalInformation;
