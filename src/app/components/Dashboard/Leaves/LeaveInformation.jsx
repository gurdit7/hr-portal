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
import SkeletonLoader from "../../Ui/skeletonLoader/skeletonLoader";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import ErrorNotification from "../../Ui/notification/loader/LoaderNotification";
import { useSocket } from "@/app/contexts/Socket/SocketContext";


const LeaveInformation = () => {
  const socket = useSocket();
  const { setBreadcrumbs } = useThemeConfig();
  const [formData, setFormData] = useState({});
  const [formDataCancel, setFormDataCancel] = useState({});
  const { userData } = useAuth();
  const { userPermissions, fetchNotifications } = useDashboard();
  const path = usePathname();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState(null);
  const [value, setValue] = useState(false);
  const [prevLeaves, setPrevLeaves] = useState(false);
  const [error, setError] = useState(false);
  const paraRef = useRef(null);
  const id = path.replace("/dashboard/leaves/", "");
  useEffect(() => {
    if (userData) {
      setFormDataCancel({
        ...formDataCancel,
        key: `${userData?._id}`,
      });
    }
    fetch(`/api/dashboard/paid-leaves?email=${user?.email}`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setPrevLeaves(res);
      });
  }, [user, userData]);
 
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch(
          `/api/dashboard/leaves?id=${id}&key=${userData?._id}`
        );
        const result = await response.json();
        setUser(result?.user);
        setLeaves(result?.leaves);

        setFormData({
          update: "leaves",
          id,
          email: result?.user?.email,
          balancedLeaves: result?.user?.balancedLeaves,
          totalLeaveTaken: result?.user?.totalLeaveTaken,
          balancedSandwichLeaves: result?.user?.balancedSandwichLeaves,
          balancedSandwichLeavesTaken:
            result?.user?.balancedSandwichLeavesTaken,
          totalUnpaidLeaveTaken: result?.user?.totalUnpaidLeaveTaken,
          unpaidSandwichLeavesTaken: result?.user?.unpaidSandwichLeavesTaken,
        });

        const leave = result?.leaves;
        if (leave?.paidLeaves > 0 && !leave?.sandwitchLeave) {
          setFormDataCancel({
            update: "cancel",
            id,
            status: "canceled",
            type: "paidLeaves",
            email: result?.user?.email,
            balancedLeaves: result?.user?.balancedLeaves + leave?.paidLeaves,
            totalLeaveTaken: result?.user?.totalLeaveTaken - leave?.paidLeaves,
          });
        } else if (leave?.unPaidLeaves > 0 && !leave?.sandwitchLeave) {
          setFormDataCancel({
            update: "cancel",
            id,
            status: "canceled",
            type: "unpaidLeaves",
            email: result?.user?.email,
            totalUnpaidLeaveTaken:
              result?.user?.totalUnpaidLeaveTaken - leave?.unPaidLeaves,
          });
        } else if (leave?.sandwitchLeave) {
          if (leave?.sandwitchLeaveData?.both && !leave?.unPaidLeaves) {
            setFormDataCancel({
              update: "cancel",
              id,
              status: "canceled",
              sandwitchLeave: true,
              type: "notUnPaidSandwichLeaves",
              email: result?.user?.email,
              balancedSandwichLeaves:
                result?.user?.balancedSandwichLeaves +
                leave?.sandwitchLeaveData?.paidLeaves,
              balancedSandwichLeavesTaken:
                result?.user?.balancedSandwichLeavesTaken -
                leave?.sandwitchLeaveData?.paidLeaves,
              unpaidSandwichLeavesTaken:
                result?.user?.unpaidSandwichLeavesTaken -
                leave?.sandwitchLeaveData?.unpaidLeaves,
            });
          } else if (
            leave?.sandwitchLeaveData.type === "paid" &&
            leave?.unPaidLeaves &&
            leave?.sandwitchLeaveData.both === false
          ) {
            setFormDataCancel({
              update: "cancel",
              id,
              status: "canceled",
              sandwitchLeave: true,
              type: "notPaidSandwichLeaves",
              email: result?.user?.email,
              balancedSandwichLeaves:
                result?.user?.balancedSandwichLeaves +
                leave?.sandwitchLeaveData?.paidLeaves,
              totalUnpaidLeaveTaken:
                result?.user?.totalUnpaidLeaveTaken - leave?.unPaidLeaves,
              balancedSandwichLeavesTaken:
                result?.user?.balancedSandwichLeavesTaken -
                leave?.sandwitchLeaveData?.paidLeaves,
            });
          } else if (
            leave?.sandwitchLeaveData.type === "paid" &&
            leave?.unPaidLeaves &&
            leave?.sandwitchLeaveData.both
          ) {
            setFormDataCancel({
              update: "cancel",
              id,
              status: "canceled",
              sandwitchLeave: true,
              type: "paidSandwichLeaves",
              email: result?.user?.email,
              balancedSandwichLeaves:
                result?.user?.balancedSandwichLeaves +
                leave?.sandwitchLeaveData?.paidLeaves,
              totalUnpaidLeaveTaken:
                result?.user?.totalUnpaidLeaveTaken - leave?.unPaidLeaves,
              balancedSandwichLeavesTaken:
                result?.user?.balancedSandwichLeavesTaken -
                leave?.sandwitchLeaveData?.paidLeaves,
              unpaidSandwichLeavesTaken:
                result?.user?.unpaidSandwichLeavesTaken -
                leave?.sandwitchLeaveData?.unpaidLeaves,
            });
          } else if (
            leave?.sandwitchLeaveData.type === "unpaid" &&
            leave?.unPaidLeaves &&
            leave?.sandwitchLeaveData.both === false
          ) {
            setFormDataCancel({
              update: "cancel",
              id,
              status: "canceled",
              sandwitchLeave: true,
              type: "unpaidLeavesSandwich",
              email: result?.user?.email,
              totalUnpaidLeaveTaken:
                result?.user?.totalUnpaidLeaveTaken - leave?.unPaidLeaves,
              unpaidSandwichLeavesTaken:
                result?.user?.unpaidSandwichLeavesTaken -
                leave?.sandwitchLeaveData?.unpaidLeaves,
            });
          } else if (leave?.sandwitchLeaveData?.type === "paid") {
            setFormDataCancel({
              update: "cancel",
              id,
              status: "canceled",
              email: result?.user?.email,
              sandwitchLeave: true,
              type: "paid",
              balancedSandwichLeaves:
                result?.user?.balancedSandwichLeaves +
                leave?.sandwitchLeaveData?.paidLeaves,
              balancedSandwichLeavesTaken:
                result?.user?.balancedSandwichLeavesTaken -
                leave?.sandwitchLeaveData?.paidLeaves,
            });
          } else if (leave?.sandwitchLeaveData?.type === "unpaid") {
            setFormDataCancel({
              update: "cancel",
              id,
              status: "canceled",
              sandwitchLeave: true,
              type: "unpaid",
              email: result?.user?.email,
              unpaidSandwichLeavesTaken:
                result?.user?.unpaidSandwichLeavesTaken -
                leave?.sandwitchLeaveData?.unpaidLeaves,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };
    if (userData) {
      fetchLeaveData();
    }
  }, [value, userData]);

  const handleFormChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      key: `${userData?._id}`,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCancelLeave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/leaves/cancel", {
        method: "PUT",
        body: JSON.stringify(formDataCancel),
      });
      const result = await response.json();
      if (result?.error) {
        setError({
          status: true,
          active: true,
          message: res?.error,
        });
        setTimeout(() => {
          setLoading(false);
          setError(false);
        }, 3000);
      } else {
        const message = {
          heading: "Your leave is canceled.",
          message: `${result.leave.subject} is canceled.`,
          link: `/dashboard/leaves/${result.leave._id}`,
          type: "leaves",
        };
        socket.emit("sendNotification", { rooms: result?.mails, message });
        setValue(true);
        setLoading(false);
      }
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
      const result = await response.json();
      if (result?.error) {
        setError({
          status: true,
          active: true,
          message: result?.error,
        });
        setTimeout(() => {
          setLoading(false);
          setError(false);
        }, 3000);
      } else {
        const message = {
          heading: "Your leave is updated.",
          message: `${result.leave.subject} is updated.`,
          link: `/dashboard/leaves/${result.leave._id}`,
          type: "leaves",
        };
        socket.emit("sendNotification", { rooms: result?.mails, message });
        setValue(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating leaves:", error);
      setLoading(false);
    }
  };
  const updateLeaves = () => {
    setShow(true);
  };

  useEffect(() => {
    const breadcrumbs = [
      {
        href: "/dashboard/leaves/",
        label: "Leaves",
      },
      {
        href: `/dashboard/leaves/${id}`,
        label: leaves?.subject,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [leaves]);
  return (
    <>
      <Wrapper className="p-5 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-[10px] flex flex-col gap-[15px] w-full relative">        

        {leaves?.subject && <H2>Subject: {leaves?.subject}</H2>}
        {!leaves?.subject && (
          <SkeletonLoader className="h-9 rounded-lg w-1/2" />
        )}
        {leaves?.description && (
          <div
            className="mt-[5px] text-sm font-medium font-poppins text-dark dark:text-white"
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
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-y min-h-[50px]">
              <Text className="!text-light-400">Applied by:</Text>
              <Text>{leaves?.name}</Text>
            </Wrapper>
          )}
          {!leaves && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-y min-h-[50px]">
              <Text className="!text-light-400">Applied by:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
          {leaves?.status && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Status:</Text>
              <Badge status={leaves?.status} />
            </Wrapper>
          )}
          {!leaves && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Status:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
          {leaves?.duration && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Duration:</Text>
              <Text>
                {leaves?.duration !== "Other"
                  ? `${leaves?.duration} on ${formatDate(leaves?.durationDate)}`
                  : `From: ${leaves?.from} - To: ${leaves?.to}`}
              </Text>
            </Wrapper>
          )}
          {!leaves && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Duration:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
          {leaves?.attachment && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Attachment:</Text>
              <Link
                href={leaves?.attachment}
                target="_blank"
                className="text-xs py-2 px-5 rounded-md text-white uppercase tracking-normal bg-red-400"
              >
                Check Attachment
              </Link>
            </Wrapper>
          )}
          {!leaves && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Attachment:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
          {userPermissions &&
            userPermissions?.includes("approve-decline-leaves") &&
            leaves?.status === "pending" && (
              <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Take Action:</Text>
                <ApproveLeave
                  id={id}
                  setValue={setValue}
                  user={user}
                  leave={leaves}
                  prevLeaves={prevLeaves}
                />
              </Wrapper>
            )}
          {userPermissions &&
            userPermissions?.includes("approve-decline-leaves") &&
            leaves?.status === "approved" && (
              <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
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
          {userPermissions &&
            userPermissions?.includes("approve-decline-leaves") &&
            leaves?.status === "not-approved" && (
              <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Take Action:</Text>
                <Wrapper>
                  <FormButton
                    type="button"
                    label="Update"
                    btnType="solid"
                    additionalCss="px-12 !bg-red-800"
                    event={updateLeaves}
                  />
                </Wrapper>
              </Wrapper>
            )}
          {leaves?.reason && (
            <Wrapper className="flex justify-between items-center p-2 max-w-1/2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Comment</Text>
              <Text className="max-w-[50%] text-right">
                {leaves?.status === "canceled"
                  ? "Your leave is canceled."
                  : leaves?.reason}
              </Text>
            </Wrapper>
          )}
          {!leaves && (
            <Wrapper className="flex justify-between items-center p-2 max-w-1/2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Comment</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
          {leaves?.updatedAt && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Applied On:</Text>
              <Text>{formatDate(leaves?.updatedAt)}</Text>
            </Wrapper>
          )}
          {!leaves && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Applied On:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
        </Wrapper>
      </Wrapper>

      {show && (
        <Modal
          opened={show}
          hideModal={() => setShow(false)}
          heading="Balanced Leaves"
        >
          <Wrapper>
            <Wrapper className="flex flex-col max-w-[576px] px-4 mx-auto">
              <Wrapper className="flex justify-between items-center p-2 max-w-1/2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Balance Leaves:</Text>
                <Text className="text-white">{user?.balancedLeaves}</Text>
              </Wrapper>
              <Wrapper className="flex justify-between items-center p-2 max-w-1/2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Paid Leaves Taken:</Text>
                <Text className="text-white">{user?.totalLeaveTaken}</Text>
              </Wrapper>
              {user?.totalUnpaidLeaveTaken !== 0 && (
                <Wrapper className="flex justify-between items-center p-2 max-w-1/2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
                  <Text className="!text-light-400">Unpaid Leaves Taken:</Text>
                  <Text className="text-white">
                    {user?.totalUnpaidLeaveTaken}
                  </Text>
                </Wrapper>
              )}
              <Wrapper className="flex justify-between items-center p-2 max-w-1/2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">
                  Balance Sandwich Leaves:
                </Text>
                <Text className="text-white">
                  {user?.balancedSandwichLeaves}
                </Text>
              </Wrapper>
              <Wrapper className="flex justify-between items-center p-2 max-w-1/2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Sandwich Leaves Taken:</Text>
                <Text className="text-white">
                  {user?.balancedSandwichLeavesTaken}
                </Text>
              </Wrapper>
              {user?.unpaidSandwichLeavesTaken !== 0 && (
                <Wrapper className="flex justify-between items-center p-2 max-w-1/2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
                  <Text className="!text-light-400">
                    Unpaid Sandwich Taken:
                  </Text>
                  <Text className="text-white">
                    {user?.unpaidSandwichLeavesTaken}
                  </Text>
                </Wrapper>
              )}
            </Wrapper>
            <form
              className="flex flex-col gap-4 max-w-[576px] px-4 mx-auto mt-5"
              onSubmit={handleUpdateLeaves}
            >
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
                  className="border-light-600 dark:border-gray-600 border !text-base !bg-transparent !text-white"
                >
                  <IconNumber size="24px" color="fill-light-400" />
                </Input>
                <Input
                  label="Total Leaves Taken"
                  placeholder="Total Leaves Taken"
                  setData={handleFormChange}
                  type="number"
                  required={true}
                  value={formData?.totalLeaveTaken || 0}
                  name="totalLeaveTaken"
                  className="border-light-600 dark:border-gray-600 border !text-base !bg-transparent !text-white"
                >
                  <IconNumber size="24px" color="fill-light-400" />
                </Input>
              </Wrapper>
              <Wrapper className="flex gap-4">
                <Input
                  label="Balanced Sandwich Leaves"
                  placeholder="Balanced Sandwich Leaves"
                  setData={handleFormChange}
                  type="number"
                  required={true}
                  value={formData?.balancedSandwichLeaves || ""}
                  name="balancedSandwichLeaves"
                  className="border-light-600 dark:border-gray-600 border !text-base !bg-transparent !text-white"
                >
                  <IconNumber size="24px" color="fill-light-400" />
                </Input>
                <Input
                  label="Sandwich Leaves Taken"
                  placeholder="Sandwich Leaves Taken"
                  setData={handleFormChange}
                  type="number"
                  required={true}
                  value={formData?.balancedSandwichLeavesTaken || 0}
                  name="balancedSandwichLeavesTaken"
                  className="border-light-600 dark:border-gray-600 border !text-base !bg-transparent !text-white"
                >
                  <IconNumber size="24px" color="fill-light-400" />
                </Input>
              </Wrapper>
              <Wrapper className="flex gap-4">
                {user?.totalUnpaidLeaveTaken !== 0 && (
                  <Input
                    label="Unpaid Leave Taken"
                    placeholder="Unpaid Leave Taken"
                    setData={handleFormChange}
                    type="number"
                    required={true}
                    value={formData?.totalUnpaidLeaveTaken || ""}
                    name="totalUnpaidLeaveTaken"
                    className="border-light-600 dark:border-gray-600 border !text-base !bg-transparent !text-white"
                  >
                    <IconNumber size="24px" color="fill-light-400" />
                  </Input>
                )}
                {user?.unpaidSandwichLeavesTaken !== 0 && (
                  <Input
                    label="Unpaid Sandwich Leaves"
                    placeholder="Unpaid Sandwich Leaves"
                    setData={handleFormChange}
                    type="number"
                    required={true}
                    value={formData?.unpaidSandwichLeavesTaken || ""}
                    name="unpaidSandwichLeavesTaken"
                    className="border-light-600 dark:border-gray-600 border !text-base !bg-transparent !text-white"
                  >
                    <IconNumber size="24px" color="fill-light-400" />
                  </Input>
                )}
              </Wrapper>
              <Wrapper className="w-full">
                <span className="text-light-400 text-xs block mb-1">
                  Reason
                </span>
                <textarea
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      update: "updated",
                      reason: e.target.value,
                    })
                  }
                  name="reason"
                  className="w-full rounded-lg h-24 p-4 text-base bg-transparent text-white border dark:border-gray-600 border-light-500 focus-visible:shadow-none focus-visible:outline-none"
                  value={formData?.reason}
                ></textarea>
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
      {error?.status && (
        <ErrorNotification
          active={error?.active}
          message={error?.message}
        ></ErrorNotification>
      )}
    </>
  );
};

export default LeaveInformation;
