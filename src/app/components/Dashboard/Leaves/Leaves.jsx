"use client";

import { useEffect, useRef, useState } from "react";
import Container from "../../Ui/DashboardContainer/Container";
import H1 from "../../Ui/H1/H1";
import H3 from "../../Ui/H3/H3";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import useAuth from "@/app/contexts/Auth/auth";
import IconInfo from "../../Icons/IconInfo";
import Text from "../../Ui/Text/Text";
import H2 from "../../Ui/H2/H2";
import DropDown from "../../Form/DropDown/select";
import IconSort from "../../Icons/IconSort";
import { defaultTheme, duration, leaveSort } from "@/app/data/default";
import { formatDate } from "@/app/utils/DateFormat";
import IconClock from "../../Icons/IconClock";
import IconSubject from "../../Icons/IconSubject";
import Input from "../../Form/Input/Input";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import IconAttachment from "../../Icons/IconAttachment";
import FormButton from "../../Form/FormButton/FormButton";
import axios from "axios";
import sendEmail from "@/app/mailer/mailer";
import { toHTML } from "../Notifications/Item";
import { TimeFormat } from "@/app/utils/TimeFormat";
import Link from "next/link";

const Leaves = ({ heading }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const { userPermissions, leaves, userData } = useAuth();
  const [user, setUser] = useState("");
  const [description, setDescription] = useState("");
  const [previousLeaves, setPreviousLeaves] = useState([]);
  const [file, setFile] = useState(null);
  const [attachment, setAttachment] = useState("Add Attachment");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [errors, setErrors] = useState({});

  const getFrom = (e) => {
    setFrom(e);
    const date = new Date(e);
    const fromValue = formatDate(date) + " at " + TimeFormat(date);
    setFormData((prev) => ({ ...prev, from: fromValue }));
  };
  const getTo = (e) => {
    setTo(e);
    const date = new Date(e);
    const toValue = formatDate(date) + " at " + TimeFormat(date);
    setFormData((prev) => ({ ...prev, to: toValue }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setAttachment(file.name);
  };

  const validateForm = () => {
    const newErrors = {
      duration: !formData.duration,
      subject: !formData.subject,
      description: !formData.description,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formDataCopy = {
      ...formData,
      email: userData.email,
      userID: userData.userID,
      name: userData.name,
    };

    if (file) {
      try {
        const random = Math.floor(Math.random() * 1000000 + 1);
        const imageFormData = new FormData();
        imageFormData.append("folder", userData.userID);
        imageFormData.append(
          "name",
          `${userData.userID}-${random}-leave-image.jpg`
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
        setLoading(false);
        return;
      }
    }
    try {
      const response = await fetch("/api/dashboard/leaves", {
        method: "POST",
        body: JSON.stringify(formDataCopy),
      });

      const data = await response.json();
      await sendEmail(
        "thefabcodeuser9@gmail.com",
        `HR Portal - ${userData.name} requested a leave.`,
        `
          <p style="text-align:left;font-size:16px;"><strong>Subject:</strong> ${
            formData.subject
          }</p>
          <p style="text-align:left;font-size:16px;"><strong>Duration:</strong> ${
            formData.duration === "Other"
              ? `From: ${formData?.from} - To:${formData?.to}`
              : formData.duration
          } </p>
          <p style="text-align:left;font-size:16px;"><strong>Description:</strong></p>
          ${formData.description}
        `,
        formDataCopy.attachment
      );
      setLoad(true);
      setLoading(false);
      setFormData("");
      setDescription("");
      setAttachment("");
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoad(false);
    setUser(leaves);
    fetch(`/api/dashboard/leaves?email=${userData?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setPreviousLeaves(data.leaves || []);
      });
  }, [leaves, userData.email, load]);

  const formErrorClass = "block text-xs mt-1 text-red-500";

  return (
    <>
      {userPermissions?.includes("balance-leaves") && (
        <Container heading={heading}>
          <Wrapper className="flex justify-between gap-[15px]">
            <LeaveSummaryCard
              title="Balance Leaves"
              count={user?.balancedLeaves || 12}
            />
            <LeaveSummaryCard
              title="Total Leaves Taken"
              count={user?.totalLeaveTaken || 0}
            />
            <LeaveSummaryCard
              title="Balance Sandwich Leaves"
              count={user?.balancedSandwichLeaves || 4}
              tooltip="Employees are granted four extra leave days annually, one per quarter, strategically aligned with weekends or public holidays."
            />
            <LeaveSummaryCard
              title="Sandwich Leaves Taken"
              count={user?.balancedSandwichLeavesTaken || 0}
            />
          </Wrapper>

          <Wrapper className="flex justify-between gap-[15px] mt-[15px]">
            <Wrapper className="bg-white rounded-[10px] p-5 w-full">
              {previousLeaves.length > 0 ? (
                <Wrapper className="flex flex-col gap-[15px]">
                  <Wrapper className="flex justify-between items-center">
                    <H2>Leave Record</H2>
                    <DropDown
                      items={leaveSort}
                      placeholder="Sort By"
                      value=""
                      name="Sort By"
                      className="!flex-none max-w-[195px] w-full"
                    >
                      <IconSort size="24px" color="fill-light-400" />
                    </DropDown>
                  </Wrapper>

                  {previousLeaves.map((item, index) => (
                    <LeaveItem item={item} key={index} index={index} />
                  ))}
                </Wrapper>
              ) : (
                <Text className="text-center my-4">
                  {defaultTheme?.leavesNoRecord}
                </Text>
              )}
            </Wrapper>

            <Wrapper className="bg-white rounded-[10px] p-5 w-full max-w-[600px]">
              <H2>Request For Leave</H2>
              <form
                className="mt-[15px] gap-[15px] flex flex-col"
                onSubmit={handleSubmit}
              >
                <Wrapper>
                  <DropDown
                    items={duration}
                    required
                    setData={handleInputChange}
                    value={formData.duration || ""}
                    name="duration"
                    placeholder="Duration"
                  >
                    <IconClock size="24px" color="stroke-light-400" />
                  </DropDown>
                  {errors.duration && (
                    <span className={formErrorClass}>
                      This field is required.
                    </span>
                  )}
                </Wrapper>

                {formData.duration === "Other" && (
                  <Wrapper className="relative w-full flex gap-4">
                    <DateTimeInput
                      label="From"
                      value={from || ""}
                      onChange={getFrom}
                      error={errors.from}
                    />
                    <DateTimeInput
                      label="To"
                      value={to || ""}
                      onChange={getTo}
                      error={errors.to}
                    />
                  </Wrapper>
                )}

                <Wrapper>
                  <Input
                    label="Subject"
                    placeholder="Subject"
                    setData={handleInputChange}
                    type="text"
                    required
                    value={formData.subject || ""}
                    name="subject"
                    className="border-light-600 border"
                  >
                    <IconSubject size="24px" color="fill-light-400" />
                  </Input>
                  {errors.subject && (
                    <span className={formErrorClass}>
                      This field is required.
                    </span>
                  )}
                </Wrapper>

                <Wrapper>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                  {errors.description && (
                    <span className={formErrorClass}>
                      This field is required.
                    </span>
                  )}
                </Wrapper>

                <Wrapper>
                  <Input
                    label="Add Attachment"
                    placeholder={attachment}
                    setData={handleFileChange}
                    type="file"
                    value=""
                    name="attachment"
                    multiple={false}
                    className="border-light-600 border"
                  >
                    <IconAttachment size="24px" color="fill-light-400" />
                  </Input>
                </Wrapper>

                <FormButton
                  type="submit"
                  loadingText="Sending..."
                  loading={loading}
                  label="Send"
                  btnType="solid"
                />
              </form>
            </Wrapper>
          </Wrapper>
        </Container>
      )}

      {userPermissions?.includes("user-leaves") && (
        <Container heading="Leave Information">
          <Wrapper className="flex justify-between gap-[15px] mt-[15px]">
            <Wrapper className="bg-white rounded-[10px] p-5 w-full">
              {previousLeaves.length > 0 ? (
                <Wrapper className="flex flex-col gap-[15px]">
                  <Wrapper className="flex justify-between items-center">
                    <H2>Leave Record</H2>
                    <DropDown
                      items={leaveSort}
                      placeholder="Sort By"
                      name="Sort By"
                      className="!flex-none max-w-[195px] w-full"
                    >
                      <IconSort size="24px" color="fill-light-400" />
                    </DropDown>
                  </Wrapper>

                  {previousLeaves.map((item, index) => (
                    <LeaveItem item={item} key={index} />
                  ))}
                </Wrapper>
              ) : (
                <Text className="text-center my-4">
                  {defaultTheme?.leavesNoRecord}
                </Text>
              )}
            </Wrapper>
          </Wrapper>
        </Container>
      )}
    </>
  );
};

const LeaveSummaryCard = ({ title, count, tooltip }) => (
  <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center">
    <H1 className="text-light-500 text-[64px] leading-none">{count || 4}</H1>
    <H3 className="text-center text-light-400 mt-[5px] flex gap-2 items-center">
      {title}
      {tooltip && (
        <span className="relative cursor-pointer group">
          <IconInfo size="18px" color="fill-dark-blue" />
          <Text className="absolute left-full top-1/2 translate-y-[-40%] bg-white border border-blue rounded-lg text-xs p-3 w-60 text-left opacity-0  invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-[-50%]">
            {tooltip}
          </Text>
        </span>
      )}
    </H3>
  </Wrapper>
);

const LeaveItem = ({ item, index }) => {
  const paraRef = useRef();
  return (
    <Wrapper className="border border-light-500 relative">
      <Wrapper className="p-3 relative">
        <Text className="!text-light-400">Leave Request</Text>
        <Wrapper className="absolute flex top-3 right-3">
          <Text
            className={`text-xs py-2 px-5 rounded-md text-white uppercase tracking-normal ${
              item?.status === "pending" ? "bg-dark" : ""
            } `}
          >
            {item?.status}
          </Text>
        </Wrapper>
        <H3>{item?.subject}</H3>
        {item?.description && (
          <div
            className="mt-[5px] text-sm font-medium font-poppins text-text-dark"
            ref={paraRef}
          >
            {toHTML(paraRef, item?.description, 350)}
          </div>
        )}
        <Wrapper className="flex justify-between items-center border-t border-light-500 pt-[5px] mt-[5px]">
          <Text>{item?.name && "Applied By: " + item?.name}</Text>
          <Text>{formatDate(item?.updatedAt)}</Text>
        </Wrapper>
      </Wrapper>
      <Link href={"/dashboard/leaves/" + item._id} className="opacity-0 absolute top-0 left-0 w-full h-full"> </Link>
    </Wrapper>
  );
};

const DateTimeInput = ({ label, value, onChange, error }) => (
  <Wrapper className="flex flex-col w-full">
    <Input
      label={label}
      placeholder={label}
      setData={(e) => onChange(e.target.value)}
      type="datetime-local"
      required
      value={value}
      name={label.toLowerCase()}
      className="border-light-600 border"
      inputClasses="!pl-[30px] !pr-0"
    />
    {error && (
      <span className="block text-xs mt-1 text-red-500">
        This field is required.
      </span>
    )}
  </Wrapper>
);

export default Leaves;
