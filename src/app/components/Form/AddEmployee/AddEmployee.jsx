"use client";
import DropDown from "@/app/components/Form/DropDown/select";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconCategory from "@/app/components/Icons/IconCategory";
import IconDate from "@/app/components/Icons/IconDate";
import IconDesignation from "@/app/components/Icons/IconDesignation";
import IconGender from "@/app/components/Icons/IconGender";
import IconMail from "@/app/components/Icons/IconMail";
import IconProfile from "@/app/components/Icons/IconProfile";
import IconUserType from "@/app/components/Icons/IconUserType";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import Notification from "@/app/components/Ui/notification/success/Notification";
import { department, designation, gender, userType } from "@/app/data/default";
import { useEffect, useState } from "react";
import ErrorNotification from "../../Ui/notification/loader/LoaderNotification";
import sendEmail from "@/app/mailer/mailer";
import useAuth from "@/app/contexts/Auth/auth";
import IconSalary from "../../Icons/IconSalary";

const AddEmployee = () => {
  const { getUsers } = useAuth();
  const [formData, setFromData] = useState({});
  const [loading, setLoading] = useState(false);
  const [__error, setErrorForm] = useState(false);
  const [show, setShow] = useState(true);
  const { userPermissions, userRoles, setAddEmployee } = useAuth();
  const formError = "block text-xs mt-1 text-red-500";
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
      [e.target.name]: e.target.value,
    });
  };

  const items = ["HI"];
  const submitForm = (e) => {
    e.preventDefault();
    const fields = [
      "userType",
      "email",
      "name",
      "joinDate",
      "role",
      "designation",
      "department",
      "gender",
      "DOB",
      "incrementDate",
      "currentSalary",
    ];
    const newErrorState = { ...__error };
    fields.forEach((item) => {
      newErrorState[item] = !formData[item];
    });
    setErrorForm(newErrorState);
    if (
      !newErrorState?.userType &&
      !newErrorState?.email &&
      !newErrorState?.name &&
      !newErrorState?.joinDate &&
      !newErrorState?.role &&
      !newErrorState?.designation &&
      !newErrorState?.department &&
      !newErrorState?.gender &&
      !newErrorState?.DOB &&
      !newErrorState?.currentSalary &&
      !newErrorState?.incrementDate
    ) {
      setLoading(true);
      fetch("/api/auth/sign-up", {
        method: "POST",
        body: JSON.stringify(formData),
      })
        .then(function (res) {
          return res.json();
        })
        .then(async function (data) {
          if (data?.email) {
            await sendEmail(
              data?.email,
              "HR Portal - You are registerd.",
              `<h2 style='text-align:center;font-size: 200%;line-height: 1;margin: 0;'>Your are registered to the The fabcode's HR Portal.</h2>
              <p style="text-align:center;">Your Password is : <strong>fc@123456</strong>.</p>
              <p style="text-align:center;">To change you password please forgot password.</p>
              `
            ).then(function (data) {
              setAddEmployee(true);
              getUsers();
              setSuccess({
                active: true,
                animation: true,
                message: "User added successfully!",
              });
              setShow(false)
              setTimeout(() => {
                setShow(true)
              }, 10);
              setFromData({});
            });
          } else if (data?.status === 403) {
            setError({
              active: true,
              animation: true,
              message: "User Already Registerd.",
            });
          } else {
            setError({
              active: true,
              animation: true,
              message: "Something when wrong! Try again later.",
            });
          }
          setLoading(false);

          setTimeout(() => {
            setError({
              active: false,
              animation: false,
              message: "",
            });
            setSuccess({
              active: false,
              animation: false,
              message: "",
            });
          }, 2000);
        });
    }
  };
  return (
    <>
      {userPermissions && userPermissions.includes("add-employee") && show && (
        <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full max-w-[550px]">
          <H2>Add Employee</H2>
          <form className="flex flex-col gap-[15px]">
            <Wrapper className="flex gap-[15px]">
              <Wrapper className="flex-1">
                <DropDown
                  items={userType}
                  required={true}
                  setData={addItemForm}
                  value={formData?.userType || ""}
                  name="userType"
                  placeholder={"User Type"}
                >
                  <IconUserType size="24px" color="#BCBCBC" />
                </DropDown>
                {__error.userType && (
                  <span className={formError}>This field is required.</span>
                )}
              </Wrapper>
              <Wrapper className="flex-1">
                <Input
                  label="Email Address"
                  placeholder="Email Address"
                  setData={addItemForm}
                  type="email"
                  required={true}
                  value={formData?.email || ""}
                  name="email"
                  className="border-light-600 border"
                >
                  <IconMail size="24px" color="fill-light-400" />
                </Input>
                {__error.email && (
                  <span className={formError}>This field is required.</span>
                )}
              </Wrapper>
            </Wrapper>
            <Wrapper className="flex gap-[15px]">
              <Wrapper className="flex-1">
                <Input
                  label="Name"
                  placeholder="Name"
                  setData={addItemForm}
                  type="text"
                  required={true}
                  value={formData?.name || ""}
                  name="name"
                  className="border-light-600 border"
                >
                  <IconProfile size="24px" color="stroke-light-400" />
                </Input>
                {__error.name && (
                  <span className={formError}>This field is required.</span>
                )}
              </Wrapper>
              <Wrapper className="relative w-full flex-1">
                <Input
                  label="Join Date"
                  placeholder="Join Date"
                  setData={addItemForm}
                  type="date"
                  required={true}
                  value={formData?.joinDate || ""}
                  name="joinDate"
                  className="border-light-600 border"
                >
                  <IconDate size="24px" color="stroke-light-400" />
                </Input>
                <label
                  className={`absolute left-[48px] top-[38px] pointer-events-none text-light-600 ${
                    formData?.joinDate ? "text-text-dark" : "text-light-600"
                  }`}
                >
                  {formData?.joinDate || "Join Date"}
                </label>
                {__error.joinDate && (
                  <span className={formError}>This field is required.</span>
                )}
              </Wrapper>
            </Wrapper>
            <Wrapper className="flex gap-[15px]">
              <Wrapper className="flex-1">
                <DropDown
                  items={designation}
                  required={true}
                  setData={addItemForm}
                  value={formData?.designation || ""}
                  name="designation"
                  placeholder={"Designation"}
                  className="max-w-[247.5px]"
                >
                  <IconDesignation size="24px" color="stroke-light-400" />
                </DropDown>
                {__error.designation && (
                  <span className={formError}>This field is required.</span>
                )}
              </Wrapper>
              <Wrapper className="flex-1">
                <DropDown
                  items={userRoles}
                  required={true}
                  setData={addItemForm}
                  value={formData?.role || ""}
                  name="role"
                  placeholder={"Role"}
                >
                  <IconProfile size="24px" color="stroke-light-400" />
                </DropDown>
                {__error.role && (
                  <span className={formError}>This field is required.</span>
                )}
              </Wrapper>
            </Wrapper>
            <Wrapper className="flex gap-[15px]">
              <Wrapper className="flex-1">
                <DropDown
                  items={department}
                  required={true}
                  setData={addItemForm}
                  value={formData?.department || ""}
                  name="department"
                  placeholder={"Department"}
                >
                  <IconCategory size="24px" color="stroke-light-400" />
                </DropDown>
                {__error.department && (
                  <span className={formError}>This field is required.</span>
                )}
              </Wrapper>
              <Wrapper className="flex-1">
                <DropDown
                  items={gender}
                  required={true}
                  setData={addItemForm}
                  value={formData?.gender || ""}
                  name="gender"
                  placeholder={"Gender"}
                >
                  <IconGender size="24px" color="stroke-light-400" />
                </DropDown>
                {__error.gender && (
                  <span className={formError}>This field is required.</span>
                )}
              </Wrapper>
            </Wrapper>
            <Wrapper className="flex gap-[15px]">
              <Wrapper className="relative w-full flex-1">
                <Input
                  label="DOB"
                  placeholder="DOB"
                  setData={addItemForm}
                  type="date"
                  required={true}
                  value={formData?.DOB || ""}
                  name="DOB"
                  className="border-light-600 border"
                >
                  <IconDate size="24px" color="stroke-light-400" />
                </Input>
                <label
                  className={`absolute left-[48px] top-[38px] pointer-events-none ${
                    formData?.DOB ? "text-text-dark" : "text-light-600"
                  }`}
                >
                  {formData?.DOB || "DOB"}
                </label>
                {__error.DOB && (
                  <span className={formError}>This field is required.</span>
                )}
              </Wrapper>
              <Wrapper className="relative w-full flex-1">
                <Input
                  label="Increment Date"
                  placeholder="Increment Date"
                  setData={addItemForm}
                  type="date"
                  required={true}
                  value={formData?.incrementDate || ""}
                  name="incrementDate"
                  className="border-light-600 border"
                >
                  <IconDate size="24px" color="stroke-light-400" />
                </Input>
                <label
                  className={`absolute left-[48px] top-[38px] pointer-events-none text-light-600 ${
                    formData?.incrementDate
                      ? "text-text-dark"
                      : "text-light-600"
                  }`}
                >
                  {formData?.incrementDate || "Increment Date"}
                </label>
                {__error.incrementDate && (
                  <span className={formError}>This field is required.</span>
                )}
              </Wrapper>
            </Wrapper>
            <Wrapper className="relative w-full flex-1">
              <Input
                label="Current Salary"
                placeholder="Current Salary"
                setData={addItemForm}
                type="text"
                required={true}
                value={formData?.currentSalary || ""}
                name="currentSalary"
                className="border-light-600 border"
              >
                <IconSalary size="24px" color="fill-light-400" />
              </Input>
              {__error.currentSalary && (
                <span className={formError}>This field is required.</span>
              )}
            </Wrapper>
            <FormButton
              event={submitForm}
              type="button"
              loadingText="Adding..."
              loading={loading}
              label="Add"
              btnType="solid"
            ></FormButton>
          </form>
        </Wrapper>
      )}
      {success?.active && (
        <Notification
          active={success?.animation}
          message={success?.message}
        ></Notification>
      )}
      {error?.active && (
        <ErrorNotification
          active={error?.animation}
          message={error?.message}
        ></ErrorNotification>
      )}
    </>
  );
};

export default AddEmployee;
