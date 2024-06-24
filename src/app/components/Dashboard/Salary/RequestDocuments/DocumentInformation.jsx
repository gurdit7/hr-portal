"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Wrapper from "../../../Ui/Wrapper/Wrapper";
import H2 from "../../../Ui/H2/H2";
import { toHTML } from "../../Notifications/Item";
import Text from "../../../Ui/Text/Text";
import Badge from "../../../Ui/Badge/Badge";
import Link from "next/link";
import useAuth from "@/app/contexts/Auth/auth";
import { formatDate } from "@/app/utils/DateFormat";
import SkeletonLoader from "../../../Ui/skeletonLoader/skeletonLoader";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import ErrorNotification from "../../../Ui/notification/loader/LoaderNotification";
import { useSocket } from "@/app/contexts/Socket/SocketContext";
import IconAttachment from "@/app/components/Icons/IconAttachment";
import axios from "axios";
import Notification from "@/app/components/Ui/notification/success/Notification";


const DocumentInformation = () => {
  const socket = useSocket();
  const { setBreadcrumbs } = useThemeConfig();
  const [formData, setFormData] = useState({});
  const { userData } = useAuth();
  const { userPermissions, getDocuments, getIndiviualDocuments } = useDashboard();
  const path = usePathname();
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const paraRef = useRef(null);
  const id = path.replace("/dashboard/documents/", "");
  const [file, setFile] = useState(null);
  const [attachment, setAttachment] = useState("Add Attachment");
  useEffect(() => {
    if (userData) {
      fetch(`/api/dashboard/document?id=${id}&key=${userData?._id}`)
        .then((res) => res.json())
        .then((data) => {
          setDocuments(data);
        });
    }
  }, [userData, loader]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setAttachment(file.name);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataCopy = {
      ...formData,
      key: userData?._id,
      email: userData?.email,
      id: id,
      userID: userData?.userID,
      name: userData?.name,
    };
    if (file) {
      try {
        const random = Math.floor(Math.random() * 1000000 + 1);
        const date = new Date();
        const time = date.getTime() + "-" + date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getDay();
        const imageFormData = new FormData();
        let name = `${userData?.userID}-${random}-${time}-documents-date.jpg`;
        if (file.type === "application/pdf") {
          name = `${userData?.userID}-${random}-${time}-documents-date.pdf`;
        } else if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          name = `${userData?.userID}-${random}-${time}-documents-date.docx`;
        }
        imageFormData.append("folder", userData?.userID);
        imageFormData.append("name", name);
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
        formDataCopy.attachment = false;
        setError({
          active: true,
          message: "File not uploaded. Please try again later.",
        });
      }
    }
    if (formDataCopy.attachment) {
      try {
        const response = await fetch("/api/dashboard/document", {
          method: "PUT",
          body: JSON.stringify(formDataCopy),
        });

        const data = await response.json();
        if (data.result) {
          setLoader(true);
          const message = {
            heading: "Document uploaded",
            message: `${data.result.name} your document is uploaded`,
            link: `/dashboard/documents/${data.result._id}`,
            type: "documentRequest",
          };
          socket.emit("sendNotification", { rooms: data.mails, message });
          setSuccess({
            active: true,
            message: "Document updated succesfully.",
          });
          if (userPermissions.includes("view-documents")) {
            getIndiviualDocuments(userData?._id);
          }
          if (userPermissions.includes("view-users-documents") || userPermissions.includes("view-team-documents")) {
            getDocuments(userData?._id, true);
          }
          setTimeout(() => {
            setSuccess(false)
            setLoading(false);
            setFormData("");
            setAttachment("");
          }, 3000);
        }
        if(data.error){
          setError({
            active: true,
            message: data.error,
          });
          setLoading(false);
          setTimeout(() => {
            setError(false);
          }, 3000);
        }
   
      } catch (err) {
        setError({
          active: true,
          message: 'Something went wrong! try again later.',
        });
        setTimeout(() => {
          setLoading(false);
          setError(false);
        }, 3000);

      }
    }
  };
  useEffect(() => {
    const breadcrumbs = [
      {
        href: "/dashboard/salary/",
        label: "Salary",
      },
      {
        href: `/dashboard/documents/${id}`,
        label: documents?.document + " - " + id,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [documents]);
  return (
    <>
      <Wrapper className="p-5 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-[10px] flex flex-col gap-[15px] w-full relative">

        {documents?.document && <H2>Subject: {documents?.document}</H2>}
        {!documents?.document && (
          <SkeletonLoader className="h-9 rounded-lg w-1/2" />
        )}
        {documents?.description && (
          <div
            className="mt-[5px] text-sm font-medium font-poppins text-dark dark:text-white"
            ref={paraRef}
          >
            {toHTML(
              paraRef,
              documents?.description,
              documents?.description.length
            )}
          </div>
        )}
        {!documents?.description && (
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
          {documents?.name && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-y min-h-[50px]">
              <Text className="!text-light-400">Applied by:</Text>
              <Text>{documents?.name}</Text>
            </Wrapper>
          )}
          {!documents && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-y min-h-[50px]">
              <Text className="!text-light-400">Applied by:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
          {documents?.status && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Status:</Text>
              <Badge status={documents?.status} />
            </Wrapper>
          )}
          {!documents && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Status:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
          {documents?.attachment && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Attachment:</Text>
              <Link
                href={documents?.attachment}
                target="_blank"
                className="text-xs py-2 px-5 rounded-md text-white uppercase tracking-normal bg-red-400"
              >
                Check Attachment
              </Link>
            </Wrapper>
          )}
          {!documents && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Attachment:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
          {userPermissions &&
            userPermissions?.includes("write-documents") &&
            documents?.status === "pending" && (
              <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
                <Text className="!text-light-400">Upload Document:</Text>

                <Wrapper className="relative flex gap-3">
                  <label
                    className="flex items-center text-sm font-medium font-poppins cursor-pointer py-2 px-5 rounded-md text-white uppercase tracking-normal bg-green-600"
                    htmlFor="uploadDocument"
                  >
                    <IconAttachment size="24px" color="fill-white" />{" "}
                    {attachment}
                  </label>
                  <input
                    id="uploadDocument"
                    name="attachment"
                    type="file"
                    placeholder={attachment}
                    required={true}
                    accept="image/jpeg, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    multiple={false}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className={`${
                        loading
                          ? "opacity-50 pointer-events-none cursor-not-allowed"
                          : ""
                      } flex items-center text-sm font-medium font-poppins cursor-pointer py-2 px-5 rounded-md text-white uppercase tracking-normal bg-accent`}
                    >
                      {loading ? "Uploading" : "Upload"}
                    </button>
                  )}
                </Wrapper>
              </Wrapper>
            )}

          {documents?.updatedAt && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Applied On:</Text>
              <Text>{formatDate(documents?.updatedAt)}</Text>
            </Wrapper>
          )}
          {!documents && (
            <Wrapper className="flex justify-between items-center p-2 dark:border-gray-600 border-light-500 border-b min-h-[50px]">
              <Text className="!text-light-400">Applied On:</Text>
              <SkeletonLoader className="h-3 rounded-lg  w-full max-w-60" />
            </Wrapper>
          )}
        </Wrapper>
      </Wrapper>

      {success?.active && (
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
    </>
  );
};

export default DocumentInformation;
