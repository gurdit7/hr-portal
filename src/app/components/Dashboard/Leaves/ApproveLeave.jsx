"use client";
import { useEffect, useState } from "react";
import FormButton from "../../Form/FormButton/FormButton";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import Modal from "../../Ui/Modal/Modal";
import Notification from "../../Ui/notification/success/Notification";
import ErrorNotification from "../../Ui/notification/loader/LoaderNotification";
import Text from "../../Ui/Text/Text";
import Input from "../../Form/Input/Input";
import IconEdit from "../../Icons/IconEdit";

const ApproveLeave = ({ id, user, setValue, leave, prevLeaves }) => {
  const [approvePopup, setApprovePopup] = useState(false);
  const [declinePopup, setDeclinePopup] = useState(false);
  const [declineForm, setDeclineForm] = useState('');
  const [approveForm, setApproveForm] = useState();
  const [approveButtonLoading, setApproveButtonLoading] = useState(false);
  const [paidLeaves, setPaidLeaves] = useState({});
  const [editLeaves, setEditLeaves] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const closeApproveModal = (e) => {
    setApprovePopup(false);
    setDeclinePopup(false);
  };
  const declineModal = (e) => {
    setDeclinePopup(true);
    setDeclineForm({
      ...declineForm,
      id:id,
      status: "not-approved",
    });
  };
  const handleApproveChange = (e) => {
    const hour = user?.balancedLeaves * 8 - leave?.durationHours;
    if (leave?.unPaidLeaves && leave?.paidLeaves) {
      setApproveForm({
        ...approveForm,
        id: id,
        email: leave?.email,
        balancedLeaves: (hour + leave?.unPaidLeaves * 8) / 8,
        totalLeaveTaken:
          (user?.totalLeaveTaken * 8 +
            (leave?.durationHours - leave?.unPaidLeaves * 8)) /
          8,
        totalUnpaidLeaveTaken: leave?.unPaidLeaves,
        [e.target.name]: e.target.value,
      });
    } else if (paidLeaves?.unPaidLeaves > 0 && !leave?.sandwitchLeave) {
      setApproveForm({
        ...approveForm,
        id: id,
        email: leave?.email,
        totalUnpaidLeaveTaken: paidLeaves?.unPaidLeaves,
        [e.target.name]: e.target.value,
      });
    } else if (
      paidLeaves?.unPaidLeaves > 0 &&
      leave?.sandwitchLeave &&
      !leave?.unPaidLeaves
    ) {
      setApproveForm({
        ...approveForm,
        id: id,
        email: leave?.email,
        unpaidSandwichLeavesTaken: paidLeaves?.unPaidLeaves,
        [e.target.name]: e.target.value,
      });
    } else if (leave?.sandwitchLeave) {
      if (leave?.sandwitchLeaveData?.both && !leave?.unPaidLeaves) {
        setApproveForm({
          ...approveForm,
          id: id,
          email: leave?.email,
          sandwitchLeave: true,
          sandwitchLeaveType: "both",
          totalLeaves:
            leave?.sandwitchLeaveData?.paidLeaves +
            leave?.sandwitchLeaveData?.unpaidLeaves,
          balancedSandwichLeavesTaken: leave?.sandwitchLeaveData?.paidLeaves,
          unpaidSandwichLeavesTaken: leave?.sandwitchLeaveData?.unpaidLeaves,
          [e.target.name]: e.target.value,
        });
      } else if (
        leave?.sandwitchLeaveData.type === "paid" &&
        leave?.unPaidLeaves &&
        leave?.sandwitchLeaveData.both === false
      ) {
        setApproveForm({
          ...approveForm,
          id: id,
          email: leave?.email,
          sandwitchLeave: true,
          sandwitchLeaveType: "paid&Leave",
          totalUnpaidLeaveTaken: leave?.unPaidLeaves,
          balancedSandwichLeavesTaken: leave?.sandwitchLeaveData?.paidLeaves,
          [e.target.name]: e.target.value,
        });
      } else if (
        leave?.sandwitchLeaveData.type === "unpaid" &&
        leave?.unPaidLeaves &&
        leave?.sandwitchLeaveData.both === false
      ) {
        setApproveForm({
          ...approveForm,
          id: id,
          email: leave?.email,
          sandwitchLeave: true,
          sandwitchLeaveType: "unpaidLeave",
          totalUnpaidLeaveTaken: leave?.unPaidLeaves,
          unpaidSandwichLeavesTaken: leave?.sandwitchLeaveData?.unpaidLeaves,
          [e.target.name]: e.target.value,
        });
      }
      
      else if (
        leave?.sandwitchLeaveData.type === "paid" &&
        leave?.unPaidLeaves &&
        leave?.sandwitchLeaveData.both
      ) {
        setApproveForm({
          ...approveForm,
          id: id,
          email: leave?.email,
          sandwitchLeave: true,
          sandwitchLeaveType: "paidLeaveBoth",
          totalUnpaidLeaveTaken: leave?.unPaidLeaves,
          unpaidSandwichLeavesTaken: leave?.sandwitchLeaveData?.unpaidLeaves,
          balancedSandwichLeavesTaken: leave?.sandwitchLeaveData?.paidLeaves,
          [e.target.name]: e.target.value,
        });
      } else if (leave?.sandwitchLeaveData?.type === "paid") {
        setApproveForm({
          ...approveForm,
          id: id,
          email: leave?.email,
          sandwitchLeave: true,
          sandwitchLeaveType: "paid",
          balancedSandwichLeavesTaken: leave?.sandwitchLeaveData?.paidLeaves,
          [e.target.name]: e.target.value,
        });
      } else if (leave?.sandwitchLeaveData?.type === "unpaid") {
        setApproveForm({
          ...approveForm,
          id: id,
          email: leave?.email,
          sandwitchLeave: true,
          sandwitchLeaveType: "unpaid",
          unpaidSandwichLeavesTaken: leave?.sandwitchLeaveData?.unpaidLeaves,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setApproveForm({
        ...approveForm,
        id: id,
        email: leave?.email,
        balancedLeaves: hour / 8,
        totalLeaveTaken: (user?.totalLeaveTaken * 8 + leave?.durationHours) / 8,
        [e.target.name]: e.target.value,
      });
    }
  };
  const approveAction = () => {
    setApprovePopup(true);
    setApproveForm({
      ...approveForm,
      update: "approve",
      status: "approved",
    });
  };
  const addReason = (e) => {
    setApproveButtonLoading(true);
    e.preventDefault();
    fetch("/api/dashboard/leaves/approve", {
      method: "PUT",
      body: JSON.stringify(approveForm),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setSuccess({
          status: true,
          active: true,
          message: `The leave is approved. We will notify ${user?.name}.`,
        });
        setTimeout(() => {
          setValue(true);
          setApproveButtonLoading(false);
          closeApproveModal();
          setSuccess(false);
        }, 3000);
      })
      .catch((error) => {
        setError({
          status: true,
          active: true,
          message: `Something went wrong try again later.`,
        });
        setTimeout(() => {
          setApproveButtonLoading(false);
          setError(false);
        }, 3000);
      });
  };
  const getEditLeaves = (e) => {
    setApproveForm({
      ...approveForm,
      [e.target.name]: e.target.value,
    });
  };
  const addDeclineReason = (e) => {
    setApproveButtonLoading(true);
    e.preventDefault();    
    fetch("/api/dashboard/leaves/decline", {
      method: "PUT",
      body: JSON.stringify(declineForm),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setSuccess({
          status: true,
          active: true,
          message: `The leave is decline. We will notify ${user?.name}.`,
        });
        setTimeout(() => {
          setValue(true);
          setApproveButtonLoading(false);
          closeApproveModal();
          setSuccess(false);
        }, 3000);
      })
      .catch((error) => {
        setError({
          status: true,
          active: true,
          message: `Something went wrong try again later.`,
        });
        setTimeout(() => {
          setApproveButtonLoading(false);
          setError(false);
        }, 3000);
      });
  }
  useEffect(() => {
    const requestedLeaves = leave?.durationHours / 8;
    if (leave.sandwitchLeave) {
      if (leave?.sandwitchLeaveData?.both && !leave?.unPaidLeaves) {
        setPaidLeaves({
          ...paidLeaves,
          paidLeaves: leave?.sandwitchLeaveData?.paidLeaves * 3,
          unPaidLeaves:
            requestedLeaves - leave?.sandwitchLeaveData?.paidLeaves * 3,
          sandwitchLeave:
            leave?.sandwitchLeaveData?.paidLeaves +
            leave?.sandwitchLeaveData?.unpaidLeaves,
          message: `${leave?.sandwitchLeaveData?.paidLeaves} paid sandwich, ${leave?.sandwitchLeaveData?.unpaidLeaves} unpaid sandwich, ${requestedLeaves} total leaves `,
        });
      } else if (
        leave?.sandwitchLeaveData.type === "paid" &&
        leave?.sandwitchLeaveData?.both &&
        leave?.unPaidLeaves
      ) {
        setPaidLeaves({
          ...paidLeaves,
          paidLeaves: leave?.sandwitchLeaveData?.paidLeaves * 3 || 0,
          unPaidLeaves:
            leave?.sandwitchLeaveData?.unpaidLeaves * 3 + leave?.unPaidLeaves ||
            0,
          sandwitchLeave:
            leave?.sandwitchLeaveData?.paidLeaves + leave?.unPaidLeaves,
          message: `${leave?.sandwitchLeaveData?.message} sandwich, ${leave?.unPaidLeaves} unpaid leave, ${requestedLeaves} total leaves`,
        });
      } 
      else if (
        leave?.sandwitchLeaveData.type === "unpaid" &&
        leave?.unPaidLeaves
      ) {
        setPaidLeaves({
          ...paidLeaves,
          paidLeaves:  0,
          unPaidLeaves: (leave?.sandwitchLeaveData?.unpaidLeaves * 3)  + leave?.unPaidLeaves,
          sandwitchLeave:
            (leave?.sandwitchLeaveData?.unpaidLeaves * 3) + leave?.unPaidLeaves,
          message: `${leave?.sandwitchLeaveData?.message} sandwich, ${leave?.unPaidLeaves} unpaid leave`,
        });
      }
      else if (
        leave?.sandwitchLeaveData.type === "paid" &&
        leave?.unPaidLeaves
      ) {
        setPaidLeaves({
          ...paidLeaves,
          paidLeaves: leave?.sandwitchLeaveData?.paidLeaves * 3 || 0,
          unPaidLeaves: leave?.unPaidLeaves || 0,
          sandwitchLeave:
            leave?.sandwitchLeaveData?.paidLeaves + leave?.unPaidLeaves,
          message: `${leave?.sandwitchLeaveData?.message} sandwich, ${leave?.unPaidLeaves} unpaid leave`,
        });
      } else {
        setPaidLeaves({
          ...paidLeaves,
          paidLeaves: leave?.sandwitchLeaveData?.paidLeaves * 3,
          unPaidLeaves: leave?.sandwitchLeaveData?.unpaidLeaves * 3 || 0,
          sandwitchLeave:
            leave?.sandwitchLeaveData?.paidLeaves +
            leave?.sandwitchLeaveData?.unpaidLeaves,
          message: `${leave?.sandwitchLeaveData?.message} sandwich `,
        });
      }
    } else if (leave?.unPaidLeaves && leave?.paidLeaves) {
      setPaidLeaves({
        ...paidLeaves,
        paidLeaves: leave?.paidLeaves,
        unPaidLeaves: leave?.unPaidLeaves,
        message: `${leave?.paidLeaves} ${
          leave?.paidLeaves > 1 ? "days" : "day"
        } will be paid, ${leave?.unPaidLeaves} ${
          leave?.unPaidLeaves > 1 ? "days" : "day"
        } will be unpaid.`,
      });
    } else if (leave?.unPaidLeaves) {
      setPaidLeaves({
        ...paidLeaves,
        paidLeaves: 0,
        unPaidLeaves: leave?.unPaidLeaves,
        message: `${leave?.unPaidLeaves} ${
          leave?.unPaidLeaves > 1 ? "days" : "day"
        } will be unpaid.`,
      });
    } else if (leave?.paidLeaves) {
      setPaidLeaves({
        ...paidLeaves,
        paidLeaves: leave?.paidLeaves,
        unPaidLeaves: 0,
        message: `${leave?.paidLeaves} ${
          leave?.paidLeaves > 1 ? "days" : "day"
        } will be paid.`,
      });
    } else if (requestedLeaves > prevLeaves?.paidLeaves) {
      const unPaidLeaves = requestedLeaves - prevLeaves?.paidLeaves;
      setPaidLeaves({
        ...paidLeaves,
        paidLeaves: prevLeaves?.paidLeaves || 0,
        unPaidLeaves,
        message: prevLeaves?.paidLeaves
          ? `${prevLeaves?.paidLeaves || 0} ${
              prevLeaves?.paidLeaves > 1 ? "days" : "day"
            } will be paid `
          : `${unPaidLeaves} ${
              unPaidLeaves > 1 ? "days" : "day"
            } will be unpaid.`,
      });
    } else if (requestedLeaves < prevLeaves?.paidLeaves) {
      let message = `${requestedLeaves || 0} ${
        requestedLeaves > 1 ? "days" : "day"
      } will be paid `;
      if (requestedLeaves === 0.5) {
        message = `Half day leave will be paid `;
      }
      if (requestedLeaves === 0.3125) {
        message = `Short leave will be paid `;
      }

      setPaidLeaves({
        ...paidLeaves,
        paidLeaves: requestedLeaves || 0,
        unPaidLeaves: 0,
        message,
      });
    }
  }, [leave]);
  return (
    <Wrapper className="flex gap-4">
      <FormButton
        type="button"
        label="Decline"
        event={declineModal}
        btnType="outlined"
      />
      <FormButton
        type="button"
        label="Approve"
        btnType="solid"
        additionalCss="px-12"
        event={approveAction}
      />

      {approvePopup && (
        <Modal
          opened={approvePopup}
          hideModal={closeApproveModal}
          heading="Reason to Approve"
        >
          <Wrapper className="max-w-[510px] m-auto">
            <form onSubmit={addReason}>
              <Wrapper className="mb-4">
                {paidLeaves && paidLeaves?.message && (
                  <Text className="text-center text-white text-xl">
                    {paidLeaves?.message}
                  </Text>
                )}
              </Wrapper>
              <Wrapper className="flex flex-col gap-4">
                <textarea
                  required
                  onChange={handleApproveChange}
                  name="reason"
                  className="w-full rounded-lg h-72 p-4 bg-transparent text-white border border-light-500 focus-visible:shadow-none focus-visible:outline-none"
                  value={approveForm?.reason}
                ></textarea>
                <Wrapper>
                  <Wrapper className="flex justify-between items-center p-2 border-light-500 border-y min-h-[50px]">
                    <Text className="!text-light-100">No. of paid leaves:</Text>
                    {!editLeaves?.paidLeaves && (
                      <Text className="!text-light-100 flex items-center gap-1">
                        {approveForm?.paidLeaves || paidLeaves?.paidLeaves}
                        <span
                          className="text-light-400 flex items-center gap-0"
                          onClick={() =>
                            setEditLeaves({
                              ...editLeaves,
                              paidLeaves: true,
                            })
                          }
                        >
                          <IconEdit size="18px" color="fill-light-400" />
                        </span>
                      </Text>
                    )}
                    {editLeaves?.paidLeaves && (
                      <Input
                        value={
                          approveForm?.paidLeaves || paidLeaves?.paidLeaves
                        }
                        setData={getEditLeaves}
                        type="number"
                        name="paidLeaves"
                        wrapperClassName="!flex-none !w-9"
                        className="border !border-light-600 !px-0 !py-1 text-center bg-transparent !text-white focus-visible:shadow-none focus-visible:outline-none"
                      ></Input>
                    )}
                  </Wrapper>
                  <Wrapper className="flex justify-between items-center p-2 border-light-500 border-b min-h-[50px]">
                    <Text className="!text-light-100">
                      No. of unpaid leaves:
                    </Text>
                    {!editLeaves?.unPaidLeaves && (
                      <Text className="!text-light-100 flex items-center gap-1">
                        {approveForm?.unPaidLeaves || paidLeaves?.unPaidLeaves}
                        <span
                          className="text-light-400 flex items-center gap-0"
                          onClick={() =>
                            setEditLeaves({
                              ...editLeaves,
                              unPaidLeaves: true,
                            })
                          }
                        >
                          <IconEdit size="18px" color="fill-light-400" />
                        </span>
                      </Text>
                    )}
                    {editLeaves?.unPaidLeaves && (
                      <Input
                        setData={getEditLeaves}
                        value={
                          approveForm?.unPaidLeaves || paidLeaves?.unPaidLeaves
                        }
                        type="number"
                        name="unPaidLeaves"
                        wrapperClassName="!flex-none !w-9"
                        className="border !border-light-600 !py-1  !px-0 text-center bg-transparent !text-white focus-visible:shadow-none focus-visible:outline-none"
                      ></Input>
                    )}
                  </Wrapper>
                </Wrapper>

                <FormButton
                  type="submit"
                  loading={approveButtonLoading}
            loadingText="Submitting"
                  label="Submit"
                  btnType="solid"
                  additionalCss="px-12"
                />
              </Wrapper>
            </form>
          </Wrapper>
          {success?.status && (
            <Notification
              active={success?.active}
              message={success?.message}
            ></Notification>
          )}
          {error?.status && (
            <ErrorNotification
              active={error?.active}
              message={error?.message}
            ></ErrorNotification>
          )}
        </Modal>
      )}
       {declinePopup && (
        <Modal
          opened={declinePopup}
          hideModal={closeApproveModal}
          heading="Reason to Decline"
        >
          <Wrapper className="max-w-[510px] m-auto">
            <form onSubmit={addDeclineReason}>
              <Wrapper className="flex flex-col gap-4">
                <textarea
                  required
                  onChange={(e) => setDeclineForm({
                    ...declineForm,
                    email: leave?.email,
                    reason:e.target.value})}
                  name="reason"
                  className="w-full rounded-lg h-72 p-4 bg-transparent text-white border border-light-500 focus-visible:shadow-none focus-visible:outline-none"
                  value={declineForm?.reason}
                ></textarea>             

                <FormButton
                  type="submit"
                  loading={approveButtonLoading}
                  loadingText="Submitting"
                  label="Submit"
                  btnType="solid"
                  additionalCss="px-12"
                />
              </Wrapper>
            </form>
          </Wrapper>
          {success?.status && (
            <Notification
              active={success?.active}
              message={success?.message}
            ></Notification>
          )}
          {error?.status && (
            <ErrorNotification
              active={error?.active}
              message={error?.message}
            ></ErrorNotification>
          )}
        </Modal>
      )}
    </Wrapper>
  );
};

export default ApproveLeave;
