"use client";
import { useState } from "react";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import Modal from "@/app/components/Ui/Modal/Modal";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import ErrorNotification from "@/app/components/Ui/notification/loader/LoaderNotification";
import Notification from "@/app/components/Ui/notification/success/Notification";
import Input from "@/app/components/Form/Input/Input";
import IconSalary from "@/app/components/Icons/IconSalary";
import useAuth from "@/app/contexts/Auth/auth";
import { useSocket } from "@/app/contexts/Socket/SocketContext";

const Approve = ({ id, user, setValue }) => {
  const socket = useSocket();
  const { userData } = useAuth();
  const [approvePopup, setApprovePopup] = useState(false);
  const [formData, setFormData] = useState({});
  const [approveButtonLoading, setApproveButtonLoading] = useState(false);
  const [heading, setHeading] = useState("Offer a Salary.");
  const [success, setSuccess] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState(false);
  const closeApproveModal = (e) => {
    setApprovePopup(false);
  };
  const declineModal = (e) => {
    setApprovePopup(true);
    setFormData({
      ...formData,
      id: id,
      key: userData?._id,
      email: user?.email,
      status: "not-approved",
    });
  };
  const approveAction = () => {
    setApprovePopup(true);
    setFormData({
      ...formData,
      id: id,
      key: userData?._id,
      email: user?.email,
      status: "approved",
    });
  };
  const addReason = (e) => {
    setApproveButtonLoading(true);
    e.preventDefault();
    fetch("/api/dashboard/appraisal", {
      method: "PUT",
      body: JSON.stringify(formData),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.mails) {
          const message = {
            heading: res?.subject,
            message: res?.reason,
            link: `/dashboard/appraisal/${res.leave._id}`,
            type: "info",
          };
          const mailsArray = [];
          mailsArray.push(res.mails);
          socket.emit("sendNotification", { rooms: mailsArray, message });
        }
        if (res.error) {
          setError({
            status: true,
            active: true,
            message: res?.error,
          });
          setTimeout(() => {
            setApproveButtonLoading(false);
            setError(false);
          }, 3000);
        } else {
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
        }
      })
      .catch((error) => {
        setError({
          status: true,
          active: true,
          message: error?.error,
        });
        setTimeout(() => {
          setApproveButtonLoading(false);
          setError(false);
        }, 3000);
      });
  };
  const handleApproveChange = (e) => {};
  const addFormValues = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
              <Input
                type="text"
                required={true}
                name="salaryOffered"
                value={formData?.salaryOffered || ""}
                setData={addFormValues}
                placeholder="Salary Offered"
                className="border border-light-600"
              >
                <IconSalary size={24} color="fill-light-600" />
              </Input>
              <span className="text-light-400 text-xs block mb-1 mt-2">
                Reason
              </span>
              <textarea
                required
                onChange={addFormValues}
                name="reason"
                className="w-full rounded-lg h-72 p-4"
                value={formData?.reason}
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
          {error.status && (
            <ErrorNotification
              active={error.active}
              message={error.message}
            ></ErrorNotification>
          )}
        </Modal>
      )}
    </Wrapper>
  );
};

export default Approve;
