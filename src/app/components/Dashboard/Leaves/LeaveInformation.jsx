"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import H2 from "../../Ui/H2/H2";
import { toHTML } from "../Notifications/Item";
import Text from "../../Ui/Text/Text";
import Badge from "../../Ui/Badge/Badge";
import Link from "next/link";
import ApproveLeave from "./ApproveLeave";
import useAuth from "@/app/contexts/Auth/auth";
import { formatDate } from "@/app/utils/DateFormat";
import { LeaveSummaryCard } from "./Leaves";
import Modal from "../../Ui/Modal/Modal";
import FormButton from "../../Form/FormButton/FormButton";
import Input from "../../Form/Input/Input";
import IconNumber from "../../Icons/IconNumber";

const LeaveInformation = () => {
  const [formData, setFormData] = useState({});
  const [formDataCancel, setFormDataCancel] = useState({});
  const { userPermissions } = useAuth();
  const path = usePathname();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState(null);
  const [value, setValue] = useState(false);
  const paraRef = useRef(null);
  const id = path.replace("/dashboard/leaves/", "");

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch(`/api/dashboard/leaves?id=${id}`);
        const result = await response.json();
        setUser(result?.user);
        setLeaves(result?.leaves);

        const balancedSandwichLeaves = result?.leaves?.durationDay === "Friday" || result?.leaves?.durationDay === "Monday"
          ? result?.user?.balancedSandwichLeaves + 1
          : result?.user?.balancedSandwichLeaves;

        setFormData({
          update: "leaves",
          email: result?.user?.email,
          balancedLeaves: result?.user?.balancedLeaves,
          totalLeaveTaken: result?.user?.totalLeaveTaken,
          balancedSandwichLeaves,
          balancedSandwichLeavesTaken: result?.user?.balancedSandwichLeavesTaken,
        });

        setFormDataCancel({
          update: "cancel",
          id,
          status: "canceled",
          email: result?.user?.email,
          balancedLeaves: result?.user?.balancedLeaves,
          balancedSandwichLeaves,
          balancedSandwichLeavesTaken: result?.user?.balancedSandwichLeavesTaken,
          totalLeaveTaken: result?.user?.totalLeaveTaken,
        });
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    fetchLeaveData();
  }, [id, value]);

  const handleFormChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCancelLeave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/leaves", {
        method: "PUT",
        body: JSON.stringify(formDataCancel),
      });
      await response.json();
      setValue(true);
      setLoading(false);
    } catch (error) {
      console.error("Error canceling leave:", error);
      setLoading(false);
    }
  };

  const handleUpdateLeaves = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/leaves", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      await response.json();
      setValue(true);
      setShow(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating leaves:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full relative">
        <H2>Subject: {leaves?.subject}</H2>
        {leaves?.description && (
          <div className="mt-[5px] text-sm font-medium font-poppins text-text-dark" ref={paraRef}>
            {toHTML(paraRef, leaves?.description, leaves?.description.length)}
          </div>
        )}
        <Wrapper>
          {leaves?.name && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-y min-h-[50px]">
              <Text className="!text-light-400">Applied by:</Text>
              <Text>{leaves?.name}</Text>
            </Wrapper>
          )}
          {leaves?.status && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Status:</Text>
              <Badge status={leaves?.status} />
            </Wrapper>
          )}
          {leaves?.duration && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Duration:</Text>
              <Text>
                {leaves?.duration !== "Other"
                  ? `${leaves?.duration} on ${formatDate(leaves?.durationDate)}`
                  : `From: ${leaves?.from} - To: ${leaves?.to}`}
              </Text>
            </Wrapper>
          )}
          {leaves?.attachment && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Attachment:</Text>
              <Link href={leaves?.attachment} target="_blank" className="text-xs py-2 px-5 rounded-md text-white uppercase tracking-normal bg-red-400">
                Check Attachment
              </Link>
            </Wrapper>
          )}
          {userPermissions?.includes("approve-decline-leaves") && leaves?.status === "pending" && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Take Action:</Text>
              <ApproveLeave id={id} setValue={setValue} user={leaves} leaves={user} />
            </Wrapper>
          )}
          {userPermissions?.includes("approve-decline-leaves") && leaves?.status === "approved" && (
            <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Take Action:</Text>
              <Wrapper>
                <FormButton
                  type="button"
                  label="Cancel"
                  btnType="solid"
                  additionalCss="px-12 !bg-red-600"
                  event={handleCancelLeave}
                  loading={loading}
                  loadingText="Canceling Leave"
                />
              </Wrapper>
            </Wrapper>
          )}
          {leaves?.reason && (
            <Wrapper className="flex justify-between items-center p-2 max-w-1/2 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Comment</Text>
              <Text>{leaves?.status === "canceled" ? "Your leave is canceled." : leaves?.reason}</Text>
            </Wrapper>
          )}
        </Wrapper>
      </Wrapper>

      {show && (
        <Modal opened={show} hideModal={() => setShow(false)} heading="Balanced Leaves">
          <Wrapper>
            <Wrapper className="flex justify-between gap-[15px] max-w-[1200px] px-4 mx-auto">
              <LeaveSummaryCard title="Balance Leaves" count={user?.balancedLeaves} />
              <LeaveSummaryCard title="Total Leaves Taken" count={user?.totalLeaveTaken} />
              <LeaveSummaryCard
                title="Balance Sandwich Leaves"
                count={user?.balancedSandwichLeaves}
                tooltip="Employees are granted four extra leave days annually, one per quarter, strategically aligned with weekends or public holidays."
              />
              <LeaveSummaryCard title="Sandwich Leaves Taken" count={user?.balancedSandwichLeavesTaken} />
            </Wrapper>
            <form className="flex flex-col gap-4 max-w-[1200px] px-4 mx-auto mt-5" onSubmit={handleUpdateLeaves}>
              <H2 className="text-center text-white">Change Leaves</H2>
              <Wrapper className="flex gap-4">
                <Input
                  label="Balanced Leaves"
                  placeholder="Balanced Leaves"
                  setData={handleFormChange}
                  type="number"
                  required={true}
                  value={formData?.balancedLeaves || ""}
                  name="balancedLeaves"
                  className="border-light-600 border"
                >
                  <IconNumber size="24px" color="fill-light-400" />
                </Input>
                <Input
                  label="Total Leaves Taken"
                  placeholder="Total Leaves Taken"
                  setData={handleFormChange}
                  type="number"
                  required={true}
                  value={formData?.totalLeaveTaken || ""}
                  name="totalLeaveTaken"
                  className="border-light-600 border"
                >
                  <IconNumber size="24px" color="fill-light-400" />
                </Input>
                <Input
                  label="Balanced Sandwich Leaves"
                  placeholder="Balanced Sandwich Leaves"
                  setData={handleFormChange}
                  type="number"
                  required={true}
                  value={formData?.balancedSandwichLeaves || ""}
                  name="balancedSandwichLeaves"
                  className="border-light-600 border"
                >
                  <IconNumber size="24px" color="fill-light-400" />
                </Input>
                <Input
                  label="Sandwich Leaves Taken"
                  placeholder="Sandwich Leaves Taken"
                  setData={handleFormChange}
                  type="number"
                  required={true}
                  value={formData?.balancedSandwichLeavesTaken || ""}
                  name="balancedSandwichLeavesTaken"
                  className="border-light-600 border"
                >
                  <IconNumber size="24px" color="fill-light-400" />
                </Input>
              </Wrapper>
              <Wrapper className="flex">
                <FormButton
                  type="submit"
                  label="Update Leaves"
                  btnType="solid"
                  additionalCss="px-12"
                  loading={loading}
                  loadingText="Updating Leaves"
                />
              </Wrapper>
            </form>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default LeaveInformation;
