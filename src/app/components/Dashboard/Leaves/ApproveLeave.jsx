"use client";

import { useState } from "react";
import FormButton from "../../Form/FormButton/FormButton";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import Modal from "../../Ui/Modal/Modal";

import Notification from "../../Ui/notification/success/Notification";
import ErrorNotification from "../../Ui/notification/loader/LoaderNotification";

const ApproveLeave = ({ id, user, setValue, leaves }) => {
  const [approvePopup, setApprovePopup] = useState(false);
  const [approveForm, setApproveForm] = useState();
  const [approveButtonLoading, setApproveButtonLoading] = useState(false);
  const [heading, setHeading] = useState("Reason to Approve");
  const [success, setSuccess] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAnimation, setErrorAnimation] = useState(false);
  const closeApproveModal = (e) => {
    setApprovePopup(false);
  };
  const declineModal = (e) => {
    setHeading("Reason to Decline");
    setApprovePopup(true);
    setApproveForm({
      ...approveForm,
      status: "not-approved",
    });
  };
  const handleApproveChange = (e) => {
    const hour = leaves?.balancedLeaves * 8 - user?.durationHours;    
    const newDate = new Date(user?.durationDate);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = days[newDate.getDay()];
    let balancedSandwichLeaves = leaves?.balancedSandwichLeaves;
    let balancedSandwichLeavesTaken = leaves?.balancedSandwichLeavesTaken;
    if (day === "Friday" || day === "Monday") {
      balancedSandwichLeaves = leaves?.balancedSandwichLeaves - 1;
      balancedSandwichLeavesTaken = (leaves?.balancedSandwichLeavesTaken * 8 + user?.durationHours) / 8;
    }
    if (heading === "Reason to Decline") {
      setApproveForm({
        ...approveForm,
        id: id,
        email: user?.email,
        [e.target.name]: e.target.value,
      });
    } else {
      setApproveForm({
        ...approveForm,
        id: id,
        email: user?.email,
        balancedLeaves: hour / 8,
        balancedSandwichLeaves: balancedSandwichLeaves,
        balancedSandwichLeavesTaken:  balancedSandwichLeavesTaken,
        totalLeaveTaken:
          (leaves?.totalLeaveTaken * 8 + user?.durationHours) / 8,
        [e.target.name]: e.target.value,
      });
    }
  };
  const approveAction = () => {
    setHeading("Reason to Approve");
    setApprovePopup(true);
    setApproveForm({
      ...approveForm,
      status: "approved",
    });
  };
  const addReason = (e) => {
    setApproveButtonLoading(true);
    e.preventDefault();
    fetch("/api/dashboard/leaves", {
      method: "PUT",
      body: JSON.stringify(approveForm),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res)
        setSuccess(true);
        setSuccessMessage("The status is changed.");
        setSuccessAnimation(true);              
        setTimeout(() => {
          setValue(true);
          setApproveButtonLoading(false);
          closeApproveModal();          
          setSuccess(false);
          setSuccessAnimation(false);
        }, 3000);
      });
  };
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
          heading={heading}
        >
          <Wrapper className="max-w-[510px] m-auto">
            <form onSubmit={addReason}>
              <textarea
                required
                onChange={handleApproveChange}
                name="reason"
                className="w-full rounded-lg h-72 p-4"
                value={approveForm?.reason}
              ></textarea>
              <Wrapper className="flex gap-4">
                <FormButton
                  type="submit"
                  loading={approveButtonLoading}
                  loadingText="Adding reason"
                  label="Add reason"
                  btnType="solid"
                  additionalCss="px-12"
                />
              </Wrapper>
            </form>
          </Wrapper>
          {success && (
            <Notification
              active={successAnimation}
              message={successMessage}
            ></Notification>
          )}
          {error && (
            <ErrorNotification
              active={errorAnimation}
              message={errorMessage}
            ></ErrorNotification>
          )}
        </Modal>
      )}
    </Wrapper>
  );
};

export default ApproveLeave;
