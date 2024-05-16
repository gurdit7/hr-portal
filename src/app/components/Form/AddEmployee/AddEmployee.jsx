"use client";
import Date from "@/app/components/Form/Date/Date";
import DropDown from "@/app/components/Form/DropDown/select";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconCategory from "@/app/components/Icons/IconCategory";
import IconClock from "@/app/components/Icons/IconClock";
import IconDate from "@/app/components/Icons/IconDate";
import IconDesignation from "@/app/components/Icons/IconDesignation";
import IconGender from "@/app/components/Icons/IconGender";
import IconMail from "@/app/components/Icons/IconMail";
import IconProfile from "@/app/components/Icons/IconProfile";
import IconUserType from "@/app/components/Icons/IconUserType";
import H1 from "@/app/components/Ui/H1/H1";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import Notification from "@/app/components/Ui/notification/success/Notification";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import { gender, userType } from "@/app/data/default";
import { useState } from "react";
import ErrorNotification from "../../Ui/notification/loader/LoaderNotification";

const AddEmployee = () => {
  const { sidebarCollapse } = useThemeConfig();
  const [formData, setFromData] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateValue, setUpdateValue] = useState('');
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
  const joinDateSet = (e) => {
    setFromData({
      ...formData,
      joinDate: e,
    });
  };
  const DOBDateSet = (e) => {
    setFromData({
      ...formData,
      DOB: e,
    });
  };
  const incrmentDateSet = (e) => {
    setFromData({
      ...formData,
      incrementDate: e,
    });
  };
  const items = ["HI"];

  const submitForm = (e) => {
    e.preventDefault();
    fetch("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if(data?.email){
            setSuccess({
                active: true,
                animation: true,
                message: "User added successfully!",
              });
        }
        else if (data?.status === 403) {
            setError({
                active: true,
                animation: true,
                message: "User Already Registerd.",
              });
        }
        else{
            setError({
                active: true,
                animation: true,
                message: "Something when wrong! Try again later.",
              });
        }
        setFromData('');
        setUpdateValue('');
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
  };
  return (
    <Wrapper
      className={`py-[10px] px-[25px] ${
        sidebarCollapse ? "ml-[100px]" : "ml-[300px]"
      }`}
    >
      <H1>Employees</H1>
      <Wrapper className="mt-[15px]">
        <Wrapper>
          <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px]">
            <H2>Add Employee</H2>
            <form className="flex flex-col gap-[15px]" onSubmit={submitForm}>
              <Wrapper className="flex gap-[15px]">
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
              </Wrapper>
              <Wrapper className="flex gap-[15px]">
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
                <Date
                  updateValue={updateValue}
                  setUpdateValue={setUpdateValue}
                  label="Join Date"
                  placeholder="Join Date"
                  getDate={joinDateSet}
                  addItemForm={addItemForm}
                  name="joinDate"
                >
                  <IconClock size="24px" color="stroke-light-400" />
                </Date>
              </Wrapper>
              <Wrapper className="flex gap-[15px]">            
                <Input
                  label="Designation"
                  placeholder="Designation"
                  setData={addItemForm}
                  type="text"
                  required={true}
                  value={formData?.designation || ""}
                  name="designation"
                  className="border-light-600 border"
                >
                  <IconDesignation size="24px" color="stroke-light-400" />
                </Input>      
                <DropDown
                  items={items}
                  required={true}
                  setData={addItemForm}
                  value={formData?.role || ""}
                  name="role"
                  placeholder={"Role"}
                >
                  <IconProfile size="24px" color="stroke-light-400" />
                </DropDown>
              </Wrapper>
              <Wrapper className="flex gap-[15px]">
                <DropDown
                  items={items}
                  required={true}
                  setData={addItemForm}
                  value={formData?.department || ""}
                  name="department"
                  placeholder={"Department"}
                >
                  <IconCategory size="24px" color="stroke-light-400" />
                </DropDown>
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
              </Wrapper>
              <Wrapper className="flex gap-[15px]">
                <Date
                  updateValue={updateValue}
                  setUpdateValue={setUpdateValue}
                  label="DOB"
                  placeholder="DOB"
                  getDate={DOBDateSet}
                  addItemForm={addItemForm}
                  name="DOB"
                >
                  <IconDate size="24px" color="stroke-light-400" />
                </Date>
                <Date
                  updateValue={updateValue}
                  setUpdateValue={setUpdateValue}
                  label="Increment Date"
                  placeholder="Increment Date"
                  getDate={incrmentDateSet}
                  addItemForm={addItemForm}
                  name='incrementDate'
                >
                  <IconDate size="24px" color="stroke-light-400" />
                </Date>
              </Wrapper>
              <FormButton
                type="submit"
                loadingText="Submiting..."
                loading={loading}
                label="Submit"
                btnType="solid"
              ></FormButton>
            </form>
          </Wrapper>
        </Wrapper>
      </Wrapper>
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
    </Wrapper>    
  );
};

export default AddEmployee;
