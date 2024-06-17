"use client";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import { useState } from "react";
import sendEmail from "@/app/mailer/mailer";
import Input from "../../Form/Input/Input";
import IconProfile from "../../Icons/IconProfile";
import IconNotes from "../../Icons/IconNotes";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import IconAttachment from "../../Icons/IconAttachment";
import FormButton from "../../Form/FormButton/FormButton";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import useAuth from "@/app/contexts/Auth/auth";
import { useSocket } from "@/app/contexts/Socket/SocketContext";
import axios from "axios";
import ErrorNotification from "../../Ui/notification/loader/LoaderNotification";
import Notification from "../../Ui/notification/success/Notification";

const AddNotification = () => {
  const socket = useSocket();
  const { userData } = useAuth();
  const [formData, setFromData] = useState({});
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [attachment, setAttachment] = useState("Add Attachment");
  const { userPermissions, fetchNotifications } = useDashboard();
  const [success, setSuccess] = useState({
    active: false,
    animation: false,
    message: "",
  });
  const [error, setError] = useState({
    active: false,
    animation: false,
    message: "",
  });
  const addItemForm = (e) => {
    setFromData({
      ...formData,
      key: userData?._id,
      [e.target.name]: e.target.value,
    });
  };
  const addDescription = (e) => {
    setDescription(e);
    setFromData({
      ...formData,
      description: e,
    });
  };
  const addAttachment = (e) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {});
    reader.readAsDataURL(e.target.files[0]);
    setFile(e.target.files[0]);
    setAttachment(e.target.files[0].name);
  };
  const submitForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formDataCopy = {
      ...formData,
      email: userData?.email,
      userID: userData?.userID,
      name: userData?.name,
    };
    if (file) {
      try {
        const random = Math.floor(Math.random() * 1000000 + 1);
        const imageFormData = new FormData();
        imageFormData.append("folder", userData?.userID);
        imageFormData.append(
          "name",
          `${userData?.userID}-${random}-notification-image.jpg`
        );
        imageFormData.append("file", file);

        const response = await axios.post(
          "https://thefabcode.org/hr-portal/upload.php",
          imageFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        formDataCopy.attachment = response.data.url;
      } catch (err) {
        setError({
          active: true,
          animation: true,
          message: "Something Went Wrong! Try again later.",
        });

        setTimeout(() => {
          setError({
            active: false,
            animation: false,
            message: "Something Went Wrong! Try again later.",
          });
        }, 3000);
        setLoading(false);
        return;
      }
    }
    fetch("/api/dashboard/notifications", {
      method: "POST",
      body: JSON.stringify(formDataCopy),
    })
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {
        if (data) {
          fetchNotifications(userData?._id, userData?.email);
          setDescription("");
          setAttachment("Add Attachment");
          setFromData("");
          const message = {
            heading: "New notification",
            message: `${data.result.subject}`,
            link: `/dashboard/notifications/${data.result._id}`,
            type: "info",
          };
          socket.emit("sendNotification", { rooms: data.mails, message });
          setLoading(false);
          setSuccess({
            active: true,
            animation: true,
            message: "Notification Sent!",
          });
        }
        if (data.error) {
          setError({
            active: true,
            animation: true,
            message: data.error,
          });

          setTimeout(() => {
            setError({
              active: false,
              animation: false,
              message: "",
            });
          }, 3000);
        }
      })
      .catch((error) => {
        setError({
          active: true,
          animation: true,
          message: "Something Went Wrong! Try again later.",
        });

        setTimeout(() => {
          setError({
            active: false,
            animation: false,
            message: "Something Went Wrong! Try again later.",
          });
        }, 3000);
      });
  };
  return (
    <>
      {userPermissions && userPermissions.includes("add-notifications") && (
        <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full max-w-[550px]">
          <H2>Add Notification</H2>
          <form className="flex flex-col gap-[15px]" onSubmit={submitForm}>
            <Input
              label="To"
              placeholder="To"
              setData={addItemForm}
              type="email"
              required={true}
              value={formData?.emails || ""}
              name="emails"
              multiple={true}
              className="border-light-600 border"
            >
              <IconProfile size="24px" color="stroke-light-400" />
            </Input>
            <Input
              label="Subject"
              placeholder="Subject"
              setData={addItemForm}
              type="text"
              required={true}
              value={formData?.subject || ""}
              name="subject"
              multiple={true}
              className="border-light-600 border"
            >
              <IconNotes size="24px" color="stroke-light-400" />
            </Input>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={addDescription}
            />
            <Input
              label="Add Attachment"
              placeholder={attachment}
              setData={addAttachment}
              type="file"
              required={false}
              value={formData?.attachment || ""}
              name="attachment"
              multiple={false}
              className="border-light-600 border"
            >
              <IconAttachment size="24px" color="fill-light-400" />
            </Input>
            <FormButton
              type="submit"
              loadingText="Sending..."
              loading={loading}
              label="Send"
              btnType="solid"
            ></FormButton>
          </form>
          {success?.status && (
            <Notification
              active={success?.active}
              message={success?.message}
            ></Notification>
          )}
          {error?.active && (
            <ErrorNotification
              active={error?.active}
              message={error?.message}
            ></ErrorNotification>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default AddNotification;
