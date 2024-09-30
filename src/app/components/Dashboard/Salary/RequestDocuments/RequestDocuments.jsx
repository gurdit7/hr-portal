"use client";

import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconDocument from "@/app/components/Icons/IconDocument";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import ErrorNotification from "@/app/components/Ui/notification/loader/LoaderNotification";
import Notification from "@/app/components/Ui/notification/success/Notification";
import useAuth from "@/app/contexts/Auth/auth";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import { useSocket } from "@/app/contexts/Socket/SocketContext";
import { defaultTheme } from "@/app/data/default";
import sendEmail from "@/app/mailer/mailer";
import { formatMonthName } from "@/app/utils/DateFormat";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const RequestDocuments = () => {
  const socket = useSocket();
  const RequestDocumentsList = [
    "Salary Slip - Last Three Months",
    "Experience Letter",
    "Other Documents",
  ];
  const { userData } = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [document, setDocument] = useState("Salary Slip - Last Three Months");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setFormData({
      email: userData?.email,
      userID: userData?.userID,
      name: userData?.name,
    });
  }, [userData]);
  const addDescription = (e) => {
    setDescription(e);
    setFormData({
      ...formData,
      key: userData?._id,
      description: e,
    });
  };
  const addDocument = (e) => {
    setDocument(e.target.value);
    if (e.target.value === "Other Documents") {
      setFormData({
        ...formData,
        document: document,
      });
    } else {
      setFormData({
        ...formData,
        document: e.target.value,
      });
    }
  };
  const submitForm = (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData?.description) {
      fetch("/api/dashboard/document", {
        method: "POST",
        body: JSON.stringify(formData),
      })
        .then(function (res) {
          return res.json();
        })
        .then(async function (data) {
          if (data?.error) {
            
          } else {
            if (data?.result?.email) {
              if (data.mails) {
                const message = {
                  heading: "New document request",
                  message: `${data.result.name} is request for document.`,
                  link: `/dashboard/documents/${data.result._id}`,
                  type: "documentRequest",
                };
                socket.emit("sendNotification", { rooms: data.mails, message });
              }
              setLoading(false);
              setSuccess(true);
              setDocument("Salary Slip - Last Three Months");
              setDescription("");
              setFormData({
                email: userData?.email,
                userID: userData?.userID,
                name: userData?.name,
              });
              setTimeout(() => {
                setSuccess(false);
              }, 2500);
            }
          }
        })
        .catch((error) => {          
          setError({
            status: true,
            message: "Something went wrong! Try again later.",
          });
        });
    } else {
      setLoading(false);
      setError({
        status: true,
        message: "Please add a message.",
      });
    }
  };
  const salarySlips = () => {};
  return (
    <Wrapper className="p-5 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-[10px] flex flex-col min-3xl:w-full max-3xl:flex-1">
      <H2>Request Documents</H2>
      <Wrapper className="mt-[15px]">
        <form onSubmit={submitForm}>
          <Wrapper className="flex gap-[10px] mb-[15px] justify-between">
            {RequestDocumentsList &&
              RequestDocumentsList.map((value, index) => (
                <Wrapper
                  key={index}
                  className="relative flex items-center gap-[5px]"
                >
                  <input
                    type="radio"
                    name="document"
                    id={"document-radio" + index}
                    value={value}
                    className="w-5 h-5 min-w-5 min-h-5 appearance-none rounded-3xl border border-light-400 checked:border-8 checked:border-dark dark:checked:border-accent"
                    onChange={addDocument}
                  />
                  <label
                    htmlFor={"document-radio" + index}
                    className="text-light-400 text-sm font-medium"
                  >
                    {value}
                  </label>
                </Wrapper>
              ))}
          </Wrapper>
          {document !== "Salary Slip - Last Three Months" &&
            document !== "Experience Letter" && (
              <Input
                type="text"
                required={true}
                name="document"
                value={document || ""}
                setData={addDocument}
                placeholder="Enter Document Name"
                className="border border-light-600"
              >
                <IconDocument size={24} color="fill-light-600" />
              </Input>
            )}
          <label className="text-light-400 text-xs font-medium border-t border-light-400 w-full block mt-[15px] pt-[15px]">
            Message for Demanding Documents
          </label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={addDescription}
            className="mt-[5px] mb-[15px]"
          />
          <FormButton
            type="submit"
            label="Request Document"
            btnType="solid"
            loading={loading}
            loadingText="Requesting Document"
          ></FormButton>
        </form>
      </Wrapper>
      {success && (
        <Notification
          active={success}
          message={defaultTheme?.requestDocumentsSuccess}
        ></Notification>
      )}
      {error.status && (
        <ErrorNotification
          active={error.status}
          message={error.message}
        ></ErrorNotification>
      )}
    </Wrapper>
  );
};

export default RequestDocuments;
