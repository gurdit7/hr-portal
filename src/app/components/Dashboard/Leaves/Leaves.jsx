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
import { duration } from "@/app/data/default";
import {
  checkMondayOrFriday,
  countFridays,
  countMondays,
  formatDate,
  getMondaysAndFridays,
} from "@/app/utils/DateFormat";
import IconClock from "../../Icons/IconClock";
import IconSubject from "../../Icons/IconSubject";
import Input from "../../Form/Input/Input";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import IconAttachment from "../../Icons/IconAttachment";
import FormButton from "../../Form/FormButton/FormButton";
import { toHTML } from "../Notifications/Item";
import { TimeFormat } from "@/app/utils/TimeFormat";
import Link from "next/link";
import Badge from "../../Ui/Badge/Badge";
import IconDate from "../../Icons/IconDate";
import Notification from "../../Ui/notification/success/Notification";
import ErrorNotification from "../../Ui/notification/loader/LoaderNotification";
import SkeletonLoader from "../../Ui/skeletonLoader/skeletonLoader";
import BalancedLeaves from "./BalancedLeaves";
import LeavesRecord from "./LeavesRecord";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";

const Leaves = () => {
  const date = new Date();
  const mon = date.getMonth() + 1;
  const day = date.getDate();
  const {setBreadcrumbs} = useThemeConfig();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [val, setVal] = useState(false);
  const [load, setLoad] = useState(false);
  const { userPermissions, userData } = useAuth();
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [attachment, setAttachment] = useState("Add Attachment");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [errors, setErrors] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [success, setSuccess] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAnimation, setErrorAnimation] = useState(false);
  const [sandwitchCount, setSandwitchCount] = useState(0);
  const [sandwitchLeavesData, setSandwitchLeavesData] = useState(false);
  const array = [0, 1, 2, 3, 4];

  const getFrom = (e) => {
    setFrom(e);
    setVal(e);
    const date = new Date(e);
    setFromDate(date);
    const fromValue = formatDate(date) + " at " + TimeFormat(date);
    setFormData((prev) => ({ ...prev, from: fromValue }));
  };
  const getTo = (e) => {
    setTo(e);
    setVal(e);
    const date = new Date(e);
    setToDate(date);
    const toValue = formatDate(date) + " at " + TimeFormat(date);
    setFormData((prev) => ({ ...prev, to: toValue }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVal(value);
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
        setError(true)
        setErrorMessage("Something Went Wrong! Try again later.")
        setErrorAnimation(true)

        setTimeout(() => {
          setErrorAnimation(false);
          setError(false);
          setLoading(false);
        }, 3000);
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
      setSuccess(true);
      setSuccessMessage("Your leave request is sent.");
      setSuccessAnimation(true);
      setLoad(true);
      setTimeout(() => {
        setSuccessAnimation(false);
        setSuccess(false);
        setLoading(false);
        setFormData("");
        setDescription("");
        setAttachment("");
      }, 3000);
    } catch (err) {
      setError(true);
      setErrorMessage("Something went wrong! please try again later");
      setErrorAnimation(true);
      setTimeout(() => {
        setErrorAnimation(false);
        setError(false);
        setLoading(false);
      }, 3000);
    }
  };

  const calculateDayDifference = (startDate, endDate) => {
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    return (endDate - startDate) / millisecondsInADay;
  };

  const checkMondaysAndFridays = (startDate, setFormData) => {
    const mondaysAndFridays = checkMondayOrFriday(startDate);
    if (mondaysAndFridays > 0) {
      setFormData((prev) => ({
        ...prev,
        sandwitchLeave: true,
        from: false,
        to: false,
        sandwitchLeaveData: {
          type: sandwitchLeavesData?.thisMonthLeaves > 0 ? "unpaid" : "paid",
          paidLeaves: sandwitchLeavesData?.thisMonthLeaves > 0 ? 0 : 1,
          both: false,
          unpaidLeaves: sandwitchLeavesData?.thisMonthLeaves > 0 ? 1 : 0,
          message:
            sandwitchLeavesData?.thisMonthLeaves > 0 ? "1 unpaid" : "1 paid",
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        from: false,
        to: false,
        sandwitchLeave: false,
        sandwitchLeaveData: {},
      }));
    }
    return mondaysAndFridays;
  };

  const handleSandwichLeave = (fridayCounts, setFormData, count) => {
    let sandwitchLeave = false;
    let sandwitchLeaveData = {};
    
    if (count === 0) {
      if (fridayCounts === 0) {
        sandwitchLeave = false;
      } else if (fridayCounts === 1) {
        sandwitchLeave = true;
        sandwitchLeaveData = {
          type: "paid",
          paidLeaves: 1,
          both: false,
          unpaidLeaves: 0,
          message: "1 paid",
        };
      } else if (fridayCounts > 1) {
        sandwitchLeave = true;
        sandwitchLeaveData = {
          type: "paid",
          paidLeaves: 1,
          both: true,
          unpaidLeaves: fridayCounts - 1,
          message: `1 paid and ${fridayCounts - 1} unpaid`,
        };
      }
    } else if (count === 1) {
      if (fridayCounts === 0) {
        sandwitchLeave = false;
      } else if (fridayCounts === 1) {
        sandwitchLeave = true;
        sandwitchLeaveData = {
          type: "unpaid",
          paidLeaves: 0,
          both: false,
          unpaidLeaves: 1,
          message: "1 unpaid",
        };
      } else if (fridayCounts > 1) {
        sandwitchLeave = true;
        sandwitchLeaveData = {
          type: "unpaid",
          paidLeaves: 0,
          both: false,
          unpaidLeaves: fridayCounts - 1,
          message: `${fridayCounts - 1} unpaid`,
        };
      }
    }
  if(formData.durationHours > 24){
    setFormData((prev) => ({
      ...prev,
      unPaidLeaves: (formData.durationHours / 8) - (fridayCounts * 3)
    }));
  }
  else{
    setFormData((prev) => ({
      ...prev,
      unPaidLeaves:0
    }));
  }

    setFormData((prev) => ({
      ...prev,
      sandwitchLeave,
      sandwitchLeaveData,
    }));
  };

  useEffect(() => {
    if (!formData?.duration) return;
    const { duration, durationDate } = formData;
    let durationHours = 8;
    switch (duration) {
      case "Half Day":
        setFormData((prev) => ({
          ...prev,
          sandwitchLeave: false,
          from: false,
          to: false,
          sandwitchLeaveData: {},
        }));
        durationHours = 4;
        break;
      case "Full Day":
        const checkMondaysAndFriday = checkMondaysAndFridays(
          durationDate,
          setFormData
        );
        setSandwitchCount(checkMondaysAndFriday);
        break;
      case "Short Leave":
        durationHours = 2.5;
        setFormData((prev) => ({
          ...prev,
          sandwitchLeave: false,
          from: false,
          to: false,
          sandwitchLeaveData: {},
        }));
        break;
      case "Other":
        const date1 = new Date(fromDate || "");
        const date2 = new Date(toDate || "");
        const formattedDate1 = new Date(
          date1.getFullYear() +
            "-" +
            (date1.getMonth() + 1) +
            "-" +
            (date1.getDate() - 1)
        );
        const formattedDate0 = new Date(
          date1.getFullYear() +
            "-" +
            (date1.getMonth() + 1) +
            "-" +
            date1.getDate()
        );
        const formattedDate2 = new Date(
          date2.getFullYear() +
            "-" +
            (date2.getMonth() + 1) +
            "-" +
            date2.getDate()
        );
        const formattedDate3 = new Date(
          date2.getFullYear() +
            "-" +
            (date2.getMonth() + 1) +
            "-" +
            (date2.getDate() - 1)
        );
        const dayDifference = calculateDayDifference(
          formattedDate1,
          formattedDate2
        );
        if (date1.getDay() === 5 || date1.getDay() === 5) {
          const fridayCounts = countFridays(formattedDate1, formattedDate2);
          setSandwitchCount(fridayCounts);
          handleSandwichLeave(
            fridayCounts,
            setFormData,
            sandwitchLeavesData?.count || 0
          );
        } else if (date1.getDay() === 1 || date2.getDay() === 1) {
          const mondaysCounts = countMondays(formattedDate1, formattedDate3);
          setSandwitchCount(mondaysCounts);
          handleSandwichLeave(
            mondaysCounts,
            setFormData,
            sandwitchLeavesData?.count || 0
          );
        }  else {
          const fridayCounts = countFridays(formattedDate0, formattedDate3);
          setSandwitchCount(fridayCounts);
          handleSandwichLeave(
            fridayCounts,
            setFormData,
            sandwitchLeavesData?.count || 0
          );
        }

        durationHours = dayDifference * 8;
        break;
      default:
        break;
    }

    setFormData((prev) => ({ ...prev, durationHours }));
  }, [val, sandwitchCount, sandwitchLeavesData?.count]);
  useEffect(() => {
    if (sandwitchCount > 0) {
      fetch(`/api/dashboard/leaves/sandwich-leaves?email=${userData.email}`)
        .then((res) => res.json())
        .then((res) => {
          setSandwitchLeavesData({
            ...sandwitchLeavesData,
            thisMonthLeaves: res?.sandwichLeaves?.length || 0,
            count: res?.sandwitchLeaves?.length || 0,
          });
        })
        .catch((error) => {
          setError(true)
          setErrorMessage("Something Went Wrong! Try again later.")
          setErrorAnimation(true)
  
          setTimeout(() => {
            setErrorAnimation(false);
            setError(false);
            setLoading(false);
          }, 3000);
        });
    } else {
      setFormData((prev) => ({
        ...prev,
        sandwitchLeave: false,
        sandwitchLeaveData: {},
      }));
    }
  }, [sandwitchCount]);
  const formErrorClass = "block text-xs mt-1 text-red-500";
  useEffect(() => {
    const breadcrumbs = [
      {
        href: "/dashboard/leaves",
        label: "Leaves",
      }
    ];
    setBreadcrumbs(breadcrumbs);
  }, []);
  return (
    <>
      {userPermissions && (
        <Container heading="Leaves">
          {userPermissions && userPermissions?.includes("balance-leaves") && (
            <BalancedLeaves />
          )}

          <Wrapper className="flex justify-between gap-[15px] mt-[15px]">
            <LeavesRecord loader={load} setLoader={setLoad} />
            {userPermissions && userPermissions?.includes("balance-leaves") && (
              <Wrapper className="w-full  max-w-[600px]">
                <Wrapper className="bg-white sticky top-4 rounded-[10px] p-5 w-full ">
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
                    {formData.duration && formData.duration !== "Other" && (
                      <Wrapper className="relative w-full flex-1">
                        <Input
                          label="Date"
                          placeholder="Date"
                          setData={handleInputChange}
                          type="date"
                          required={true}
                          value={formData?.durationDate || ""}
                          name="durationDate"
                          className="border-light-600 border"
                        >
                          <IconDate size="24px" color="stroke-light-400" />
                        </Input>
                        <label
                          className={`absolute left-[48px] top-[38px] pointer-events-none text-light-600 font-medium ${
                            formData?.durationDate
                              ? "text-text-dark"
                              : "text-light-600"
                          }`}
                        >
                          {formData?.durationDate || "Date"}
                        </label>
                      </Wrapper>
                    )}
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
            )}
          </Wrapper>
        </Container>
      )}
      {!userPermissions && (
        <Container heading={false}>
          <Wrapper className="flex justify-between gap-[15px] mt-[15px]">
            <Wrapper className="bg-white rounded-[10px] p-5 w-full">
              <Wrapper className="flex flex-col gap-[15px]">
                <Wrapper className="flex justify-between items-center">
                  <SkeletonLoader className="w-full max-w-[172px] !h-9 rounded-lg" />
                  <SkeletonLoader className="!h-[58px] !w-[195px] rounded-lg"></SkeletonLoader>
                </Wrapper>

                {array.map((item, index) => (
                  <Wrapper
                    key={index}
                    className="border border-light-500 relative"
                  >
                    <Wrapper className="p-3 relative">
                      <SkeletonLoader className="w-full max-w-[172px] !h-5 rounded-3xl" />
                      <SkeletonLoader className="w-full max-w-[50%] !h-[27px] rounded-3xl mt-1 mb-2" />
                      <Wrapper className="flex flex-col gap-2 mt-2 mb-2">
                        <SkeletonLoader className="!h-3 rounded-3xl  w-1/3" />
                        <SkeletonLoader className="!h-3 rounded-3xl  w-1/4" />
                        <SkeletonLoader className="!h-3 rounded-3xl  w-1/5" />
                        <SkeletonLoader className="!h-3 rounded-3xl  w-1/6" />
                      </Wrapper>
                      <Wrapper className="absolute flex top-3 right-3 w-full max-w-[103px]">
                        <SkeletonLoader className="!h-8 rounded-md  w-full max-w-[103px]" />
                      </Wrapper>

                      <Wrapper className="flex justify-between items-center border-t border-light-500 pt-[5px] mt-[5px]">
                        <SkeletonLoader className="!h-3 rounded-3xl  w-full max-w-[172px]" />
                        <SkeletonLoader className="!h-3 rounded-3xl  w-full max-w-[172px]" />
                      </Wrapper>
                    </Wrapper>
                  </Wrapper>
                ))}
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </Container>
      )}

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
    </>
  );
};

export const LeaveSummaryCard = ({ title, count, tooltip, className }) => (
  <Wrapper
    className={
      className +
      " p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full items-center"
    }
  >
    <H1 className="text-light-500 text-[64px] leading-none">{count}</H1>
    <H3 className="text-center text-light-400 mt-[5px] flex gap-2 items-center text-sm">
      {title}
      {tooltip && (
        <span className="relative cursor-pointer group">
          <IconInfo size="18px" color="fill-dark-blue" />
          <Text className="absolute left-full top-1/2 translate-y-[-40%] bg-white border border-blue rounded-lg !text-xs p-3 w-60 text-left opacity-0  invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-[-50%]">
            {tooltip}
          </Text>
        </span>
      )}
    </H3>
  </Wrapper>
);

export const LeaveItem = ({ item, index }) => {
  const paraRef = useRef();
  return (
    <Wrapper className="border border-light-500 relative">
      <Wrapper className="p-3 relative">
        <Text className="!text-light-400">Leave Request</Text>
        <Wrapper className="absolute flex top-3 right-3">
          <Badge status={item?.status} />
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
          <Text>Updated on: {formatDate(item?.updatedAt)}</Text>
        </Wrapper>
      </Wrapper>
      <Link
        href={"/dashboard/leaves/" + item._id}
        className="opacity-0 absolute top-0 left-0 w-full h-full"
      >
        {" "}
      </Link>
    </Wrapper>
  );
};

export const DateTimeInput = ({ label, value, onChange, error }) => (
  <Wrapper className="relative w-full flex-1">
    <Input
      label={label}
      placeholder={label}
      setData={(e) => onChange(e.target.value)}
      type="date"
      required={true}
      value={value}
      name={label.toLowerCase()}
      className="border-light-600 border"
    >
      <IconDate size="24px" color="stroke-light-400" />
    </Input>
    <label
      className={`absolute left-[48px] top-[38px] pointer-events-none text-light-600 ${
        value ? "text-text-dark" : "text-light-600"
      }`}
    >
      {value || "Date"}
    </label>
  </Wrapper>
);

export default Leaves;
