"use client";

import { useEffect, useState } from "react";
import FormButton from "../../Form/FormButton/FormButton";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import Modal from "../../Ui/Modal/Modal";

import Notification from "../../Ui/notification/success/Notification";
import ErrorNotification from "../../Ui/notification/loader/LoaderNotification";
import useAuth from "@/app/contexts/Auth/auth";
import Text from "../../Ui/Text/Text";
import IconNumber from "../../Icons/IconNumber";
import Input from "../../Form/Input/Input";

const ApproveLeave = ({ id, user, setValue, leaves, prevLeaves }) => {
  const {userData} = useAuth();
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
  const [paidLeaves, setPaidLeaves] = useState({});
  useEffect(()=>{
    const requestedLeaves = user?.durationHours / 8;

    if(requestedLeaves > prevLeaves?.paidLeaves){
        const unPaidLeaves = requestedLeaves - prevLeaves?.paidLeaves;
        setPaidLeaves({
          ...paidLeaves,
          paidLeaves:prevLeaves?.paidLeaves,
          unPaidLeaves,
          message:`${prevLeaves?.paidLeaves} ${prevLeaves?.paidLeaves > 1 ? 'days' : 'day'} will be paid and ${unPaidLeaves} ${unPaidLeaves > 1 ? 'days' : 'day'} will be unpaid.`
        })
    }
    else{
      setPaidLeaves({
        ...paidLeaves,
        paidLeaves:prevLeaves?.paidLeaves,
        unPaidLeaves:0,
        message:"This will be paid leave."
      })
    }
  },[prevLeaves])
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
      update:"approve",
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
              <Wrapper className='mb-4'>
             {paidLeaves && paidLeaves?.message && <Text className="text-center text-white text-xl">{paidLeaves?.message}</Text> }         
              </Wrapper>
              <Wrapper className="flex flex-col gap-4">
              <Input 
            onChange={handleApproveChange}
            value={approveForm?.paidLeaves || paidLeaves?.paidLeaves}
            type="number"
            placeholder="No. of paid leaves."
            name="paidLeaves"
            wrapperClassName="!flex-none"
            className="border border-light-600"
          >
            <IconNumber size="24px" color="fill-light-400" />
          </Input>
          <Input 
            onChange={handleApproveChange}
            value={approveForm?.unPaidLeaves || paidLeaves?.unPaidLeaves}
            type="number"
            placeholder="No. of unpaid leaves."
            name="unPaidLeaves"
            wrapperClassName="!flex-none"
            className="border border-light-600"
          >
            <IconNumber size="24px" color="fill-light-400" />
          </Input>
              <textarea
                required
                onChange={handleApproveChange}
                name="reason"
                className="w-full rounded-lg h-72 p-4"
                value={approveForm?.reason}
              ></textarea>
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

