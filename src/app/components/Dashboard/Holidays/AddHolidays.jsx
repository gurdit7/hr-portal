"use client";

import { useState } from "react";
import Input from "../../Form/Input/Input";
import IconDate from "../../Icons/IconDate";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import IconCategory from "../../Icons/IconCategory";
import FormButton from "../../Form/FormButton/FormButton";
import { formatDay, formatMonth, formatYear } from "@/app/utils/DateFormat";
import Notification from "../../Ui/notification/success/Notification";
import ErrorNotification from "../../Ui/notification/loader/LoaderNotification";

const AddHolidays = () => {
  const [formData, setFromData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    active: false,
    message: "",
  });
  const [error, setError] = useState({
    active: false,
    message: "",
  });
  const addItemForm = (e) => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const formError = "";
  const submitForm = (e) => {
    e.preventDefault();
    const date = formatMonth(formData?.date);
    const day = formatDay(formData?.date);
    const year = formatYear(formData?.date);    
    fetch("/api/dashboard/holidays", {
      method: "POST",
      body: JSON.stringify({
        date: date,
        festival: formData?.festivals,
        day: day,
        year:year
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setLoading(true);
        setSuccess({
          active: true,
          message: "Holiday is added successfully.",
        });
        setTimeout(() => {
          setSuccess({
            active: false,
            message: "Holiday is added successfully.",
          });
          setFromData("");
          setLoading(false);
        }, 2000);
        return res;
      })
      .catch((err) => {
        setError({
          active: true,
          message: "Something went wrong. Try again later!",
        });
        setTimeout(() => {
          setError({
            active: false,
            message: "Something went wrong. Try again later!",
          });
        }, 2000);
      });
  };
  return (
    <form className="flex flex-col gap-[15px]" onSubmit={submitForm}>
      <Wrapper className="relative w-full flex-1">
        <Input
          label="Date"
          placeholder="Date"
          setData={addItemForm}
          type="date"
          required={true}
          value={formData?.date || ""}
          name="date"
          className="border-light-600 border"
        >
          <IconDate size="24px" color="stroke-light-400" />
        </Input>
        <label
          className={`absolute left-[48px] top-[38px] pointer-events-none text-light-600 ${
            formData?.date ? "text-text-dark" : "text-light-600"
          }`}
        >
          {formData?.date || "Date"}
        </label>
 
      </Wrapper>
      <Wrapper className="relative w-full flex-1">
        <Input
          label="Festivals"
          placeholder="Festivals"
          setData={addItemForm}
          type="text"
          required={true}
          value={formData?.festivals || ""}
          name="festivals"
          className="border-light-600 border"
        >
          <IconCategory size="24px" color="stroke-light-400" />
        </Input>

      </Wrapper>
      <FormButton
        type="submit"
        loadingText="Adding..."
        loading={loading}
        label="Add"
        btnType="solid"
      ></FormButton>
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
    </form>
  );
};

export default AddHolidays;
