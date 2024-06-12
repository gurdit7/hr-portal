"use client";
import DropDown from "@/app/components/Form/DropDown/select";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconCategory from "@/app/components/Icons/IconCategory";
import IconMail from "@/app/components/Icons/IconMail";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import ErrorNotification from "@/app/components/Ui/notification/loader/LoaderNotification";
import Notification from "@/app/components/Ui/notification/success/Notification";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import { department, userType } from "@/app/data/default";
import { useState } from "react";

const Assign = () => {
    const {departments} = useDashboard();
  const [formData, setFormData] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const [dropDown, setDropDown] = useState(true);
  const [success, setSuccess] = useState({
    active: false,
    message: "",
  });
  const [error, setError] = useState({
    active: false,
    message: "",
  });
  const setFormValues = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const assignDepartment = (e) => {
    e.preventDefault();
    setBtnLoader(true);
    console.log(formData)
    fetch("/api/dashboard/departments", {
      method: "PUT",
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => { 
        if(response?.email){
        setSuccess({
          active: true,
          message: `New Department is assigned to ${formData?.email}`,
        });
    }

        setTimeout(() => {
          setBtnLoader(false);
          setFormData("");
          setDropDown(false)
          setTimeout(() => {
              setDropDown(true)
          }, 1);
          setSuccess({
            active: false,
            message: "",
          });
        }, 2000);
      })
      .catch((error) => {
        setError({
          active: true,
          message: "Something went wrong! try again later.",
        });

        setTimeout(() => {
          setBtnLoader(false);
          setError({
            active: false,
            message: "",
          });
        }, 2000);
      });
  };
  return (
    <Wrapper className="bg-white rounded-lg p-5 flex flex-col gap-4 max-w-[515px] w-full">
      <H2>Assign Department</H2>
      <form className=" flex flex-col gap-4" onSubmit={assignDepartment}>
        {dropDown && (
        <DropDown
          items={departments?.length > 0 ? departments :  department}
          required={true}
          setData={setFormValues}
          value={formData?.department || ""}
          name="department"
          placeholder={"Department"}
        >
          <IconCategory size="24px" color="fill-light-400" />
        </DropDown>
        )}
        <Input
          value={formData?.email || ''}
          setData={setFormValues}
          type="email"
          required={true}
          placeholder="User Email Address"
          name="email"
          wrapperClassName="!flex-none"
          className="border border-light-600"
        >
          <IconMail size="24px" color="fill-light-400" />
        </Input>
        <FormButton
          type="submit"
          label="Assign Department"
          loading={btnLoader}
          loadingText="Assigning Department"
          btnType="solid"
        ></FormButton>
      </form>
      {success.active && (
        <Notification active={success.active} message={success.message} />
      )}
      {error.active && (
        <ErrorNotification active={error.active} message={error.message} />
      )}
    </Wrapper>
  );
};

export default Assign;
