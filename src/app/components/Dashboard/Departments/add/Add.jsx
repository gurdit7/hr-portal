"use client";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconCategory from "@/app/components/Icons/IconCategory";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import ErrorNotification from "@/app/components/Ui/notification/loader/LoaderNotification";
import Notification from "@/app/components/Ui/notification/success/Notification";
import useAuth from "@/app/contexts/Auth/auth";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import { useState } from "react";

const Add = () => {
    const {userData} = useAuth();
    const {getDepartments} = useDashboard();
  const [name, setName] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
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
  const addDepartment = (e) => {
    e.preventDefault();
    setBtnLoader(true);
    fetch("/api/dashboard/departments", {
      method: "POST",
      body: JSON.stringify({ name: name.toLowerCase() }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setSuccess({
          active: true,
          message: "Department is added.",
        });

        setTimeout(() => {
            getDepartments(userData?._id)
          setBtnLoader(false);
          setName("");
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
      <H2>Add New Department</H2>
      <form className=" flex flex-col gap-4" onSubmit={addDepartment}>
        <Input
          value={name}
          setData={getName}
          type="text"
          required={true}
          placeholder="Department Name"
          name="Department Name"
          wrapperClassName="!flex-none"
          className="border border-light-600"
        >
          <IconCategory size="24px" color="fill-light-400" />
        </Input>
        <FormButton
          type="submit"
          label="Add Department"
          loading={btnLoader}
          loadingText="Adding Department"
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
