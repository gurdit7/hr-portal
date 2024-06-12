"use client";
import { useEffect, useState } from "react";
import Input from "../Input/Input";
import "./style.css";
import IconMail from "../../Icons/IconMail";
import Password from "../Password/Password";
import IconLock from "../../Icons/IconLock";
import FormButton from "../FormButton/FormButton";
import Text from "../../Ui/Text/Text";
import { useRouter } from "next/navigation";
import useAuth from "@/app/contexts/Auth/auth";
import Notification from "../../Ui/notification/success/Notification";
import ErrorNotification from "../../Ui/notification/loader/LoaderNotification";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
const LoginForm = () => {
  const route = useRouter();
  const {userData} = useAuth();
  const [active, setActive] = useState(false)
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
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
  const { setUserData, setUserLoggedIn} = useAuth();
  const {  setPermissions  } = useDashboard();
  const setFormValues = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const submitForm = (e) => {
    e.preventDefault();
    fetch("/api/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data?.status === 200) {
          setSuccess({
            active: true,
            animation: true,
            message: "Login Successfully",
          });          

          setTimeout(() => {
            setUserLoggedIn(true);
            setUserData(data?.user);
            route.push('/'); 
            setPermissions(data?.permissions);
          }, 500);
           
          

        } else if (data?.status === 403) {
          setError({
            active: true,
            animation: true,
            message: "Password incorrect.",
          });
        } else if (data?.status === 404) {
          setError({
            active: true,
            animation: true,
            message: "User not found please check email address.",
          });
        }
        setTimeout(function () {
          setSuccess({
            ...success,
            animation: false,
          });
          setError({
            ...error,
            animation: false,
          });
          setTimeout(function () {
            setSuccess({
              active: false,
              animation: false,
              message: "",
            });
            setError({
              active: false,
              animation: false,
              message: "",
            });
          }, 200);
        }, 2000);
      });
  };
  const forgotPassword = () => {
    route.push("/account/forgot-password");
  };
  return (
    <form
      className="max-w-[500px] w-full flex flex-col gap-[15px]"
      onSubmit={submitForm}
    >
      <Input
        name="email"
        value={formData?.email || ""}
        type="email"
        setData={setFormValues}
        required
        placeholder="Email Address"
      >
        <IconMail size="24px" color="fill-[#C2C3CB]" />
      </Input>
      <Password
      label="Password"
        name="password"
        required
        setData={setFormValues}
        value={formData?.password || ""}
      >
        <IconLock size="24px" color="fill-[#C2C3CB]" />
      </Password>
      <FormButton
        loading={loading}
        loadingText="Signing..."
        type="submit"
        label="Sign In"
        btnType="solid"
      />
      <Text className="text-center font-poppins text-sm font-medium text-white">
        Can&apos;t remember password?{" "}
        <FormButton
          event={forgotPassword}
          label="Forgot Password"
          type="button"
          btnType="link"
        />
      </Text>

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
    </form>
  );
};

export default LoginForm;
