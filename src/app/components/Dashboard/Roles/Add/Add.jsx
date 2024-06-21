"use client";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconCategory from "@/app/components/Icons/IconCategory";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import ErrorNotification from "@/app/components/Ui/notification/loader/LoaderNotification";
import Notification from "@/app/components/Ui/notification/success/Notification";
import useAuth from "@/app/contexts/Auth/auth";

import { useState } from "react";
import Permissions from "./Permissions";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";

const Add = () => {
  const { userData } = useAuth();
  const {getUserRoles} = useDashboard();
  const [name, setName] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState({
    active: false,
    message: "",
  });
  const [error, setError] = useState({
    active: false,
    message: "",
  });
  const getName = (e) => {
    setName(e.target.value);
  };
  const getFormData = (e)=>{
    setFormData(e)
  }
  const hideNotifications = () =>{
    setTimeout(() => {
      setError({
        active: false,
        message: "",
      });
      setSuccess({
        active: false,
        message: "",
      });
    }, 3000);
  }
  const addRole = (e) => {
    e.preventDefault();
    setBtnLoader(true)
    const selectedPermissions = [];
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value === true) {
        selectedPermissions.push(key);
      }
    }); 
    if(selectedPermissions.length > 0){
    fetch("/api/dashboard/roles", {
      method: "POST",
      body: JSON.stringify({
        name: name.toLowerCase(),
        permissions: selectedPermissions,
        key: `${userData?._id}`,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
     
        if (res?.success) {
          setSuccess({
            active: true,
            message: "Role is added successfully.",
          });
          hideNotifications();
          getUserRoles(userData?._id);
          setName('');
        }
        if (res?.error) {
          setError({
            active: true,
            message: res?.error,
          });
          hideNotifications();
        }
        setBtnLoader(false)
      }).catch(error =>{
        setBtnLoader(false)
        setError({
          active: true,
          message: "Something went wrong! Try again later.",
        });
        hideNotifications();
      });
    }
    else{
      setBtnLoader(false)
      setError({
        active: true,
        message: "Please select a value.",
      });
      hideNotifications();
    }
  };
  return (
    <Wrapper className="bg-white dark:bg-gray-700 dark:border-gray-600 rounded-lg p-5 flex flex-col gap-4 max-w-[515px] w-full">
      <H2>Add New Role</H2>
      <form className=" flex flex-col gap-4" onSubmit={addRole}>
        <Input
          value={name}
          setData={getName}
          type="text"
          required={true}
          placeholder="Role Name"
          name="name"
          wrapperClassName="!flex-none"
          className="border border-light-600"
        >
          <IconCategory size="24px" color="fill-light-400" />
        </Input>
          <Permissions getFormData={getFormData}/>
        <FormButton
          type="submit"
          label="Add Designation"
          loading={btnLoader}
          loadingText="Adding Designation"
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

export default Add;
