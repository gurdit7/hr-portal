"use client";
import DropDown from "@/app/components/Form/DropDown/select";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconCircleUser from "@/app/components/Icons/IconCircleUser";
import IconMail from "@/app/components/Icons/IconMail";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import ErrorNotification from "@/app/components/Ui/notification/loader/LoaderNotification";
import Notification from "@/app/components/Ui/notification/success/Notification";
import useAuth from "@/app/contexts/Auth/auth";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import { useState } from "react";

const Assign = () => {
    const { userData } = useAuth();
    const { userRoles } = useDashboard();
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
      key:`${userData?._id}`, 
      [e.target.name]: e.target.value,
    });
  };
  const assignRoles = (e) => {
    e.preventDefault();
    setBtnLoader(true);
    fetch("/api/dashboard/roles", {
      method: "PUT",
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response?.email) {
          setSuccess({
            active: true,
            message: `New Role is assigned to ${formData?.email}`,
          });
        }

        setTimeout(() => {
          setBtnLoader(false);
          setFormData("");
          setDropDown(false);
          setTimeout(() => {
            setDropDown(true);
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
    <Wrapper className="bg-white dark:bg-gray-700 dark:border-gray-600 rounded-lg p-5 flex flex-col gap-4 max-w-[515px] w-full">
      <H2>Assign Role</H2>
      <form className=" flex flex-col gap-4" onSubmit={assignRoles}>
        {dropDown && (
          <DropDown
            items={userRoles}
            required={true}
            setData={setFormValues}
            value={formData?.role || ""}
            name="role"
            placeholder={"Role"}
          >
            <IconCircleUser size="24px" color="fill-light-400" />
          </DropDown>
        )}
        <Input
          value={formData?.email || ""}
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
          label="Assign Role"
          loading={btnLoader}
          loadingText="Assigning Role"
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
