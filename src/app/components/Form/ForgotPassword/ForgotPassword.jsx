"use client";
import { useRef, useState } from "react";
import Input from "../Input/Input";
import IconMail from "../../Icons/IconMail";
import FormButton from "../FormButton/FormButton";
import Text from "../../Ui/Text/Text";
import { useRouter } from "next/navigation";
import sendEmail from "@/app/mailer/mailer";
import Notification from "../../Ui/notification/success/Notification";
import ErrorNotification from "../../Ui/notification/loader/LoaderNotification";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import H1 from "../../Ui/H1/H1";
import Password from "../Password/Password";
import IconLock from "../../Icons/IconLock";
const ForgotPassword = () => {
  const route = useRouter();
  const [formData, setFormData] = useState({});
  const [formDataOTP, setFormDataOTP] = useState({});
  const [formDataNewPassword, setFormDataNewPassword] = useState({});
  const [success, setSuccess] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAnimation, setErrorAnimation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [formShow, setFormShow] = useState("form");
  const [seconds, setSeconds] = useState(300);
  const [resend, setResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const otpRef = useRef("");
  const generateOTP = (limit) => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < limit; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if(seconds === 0 && minutes === 0){
      setResend(false);
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const setFormValues = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const setOTPFormValues = (e) => {
    if (e.target.value.length > 1) {
    } else {
      setFormDataOTP({
        ...formDataOTP,
        [e.target.name]: e.target.value,
      });
    }
  };
  const timerFN = ()=>{
    const timer = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(timer);
  }
  const handleSendEmail = async (email) => {
    const otp = generateOTP(4);
    const data = await sendEmail(
      email,
      "HR Portal - Password reset",
      `<p style='text-align:center;'>Password reset OTP:</p> 
      <h2 style='text-align:center;font-size: 350%;line-height: 1;margin: 0;'>${otp}</h2>
      <p style='text-align:center;'> Use this code within 5 minutes.</p>`
    ).then(function (data) {
      if (data === true) {
        setSuccess(true);
        setSuccessMessage("Email set successfully. Please check your's email.");
        setSuccessAnimation(true);
        fetch("/api/auth/send-otp", {
          method: "POST",
          body: JSON.stringify({ email: formData?.email, otp: otp }),
        })
          .then(function (res) {
            return res;
          })
          .then(function (data) {
            if (data.status === 200) {
              setFormShow("otp");
              setResend(true);
              timerFN()
              if(resend){
                setResendMessage('resend')                                
              }
              else{
                setResendMessage('otp')        
              }
              setTimeout(() => {
                setSuccess(false);
                setSuccessAnimation(false);
              }, 3000);
              
            }
          });
      } else {
        setError(true);
        setErrorMessage("Email Not Sent, Try again Later");
        setErrorAnimation(true);
        setTimeout(() => {
          setError(false);
          setErrorAnimation(false);
          setFormData("");
        }, 3000);
      }
      setLoading(false);
    });
  };
  const submitForm = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch("/api/auth/user-exist", {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.user === true) {
          handleSendEmail(formData?.email);
        } else {
          setLoading(false);
          setError(true);
          setErrorAnimation(true);
          setFormData("");
          setTimeout(() => {
            setErrorMessage("User Not Found");
            setError(false);
            setErrorAnimation(false);
          }, 3000);
        }
      });
  };
  const forgotPassword = () => {
    route.push("/account/login");
  };

  const tabChange = function (val) {
    let ele = otpRef.current.children;
    if (ele[val - 1].value != "" && val !== 4) {
      ele[val].focus();
    } else if (ele[val - 1].value == "" && val !== 1) {
      ele[val - 2].focus();
    }
  };
  const resendMail = (e)=>{
    setSeconds(300)
    submitForm(e);
  }
  const forgotPasswordOTP = (e) => {
    e.preventDefault();
    setLoadingOTP(true);
    fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        email: formData?.email,
        otp:
          formDataOTP?.opt1 +
          formDataOTP?.opt2 +
          formDataOTP?.opt3 +
          formDataOTP?.opt4,
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data?.status === 202) {
          setSuccess(true);
          setSuccessMessage("Verified");
          setSuccessAnimation(true);
          setFormDataOTP(" ");
          setFormShow("newPassword");
          setLoadingOTP(false);
          setTimeout(() => {
            setSuccess(false);
            setSuccessAnimation(false);
          }, 3000);
        } else if (data?.status === 401) {
          setError(true);
          setErrorMessage("OTP Not Matched. Please enter correct OTP.");
          setErrorAnimation(true);
          setFormDataOTP(" ");
          setLoadingOTP(false);
          setTimeout(() => {
            setError(false);
            setErrorAnimation(false);
          }, 3000);
        } else if (data?.status === 410) {
          setError(true);
          setErrorMessage("OTP expired. Please try again.");
          setErrorAnimation(true);
          setFormDataOTP(" ");
          setLoadingOTP(false);
          setTimeout(() => {
            setError(false);
            setErrorAnimation(false);
          }, 3000);
        }
      });
  };
  const setNewFormData = (e) => {
    setFormDataNewPassword({
      ...formDataNewPassword,
      [e.target.name]: e.target.value,
    });
  };
  const newPassword = (e) => {
    setLoading(true);
    e.preventDefault();

    if (formDataNewPassword?.password === formDataNewPassword?.cpassword) {
      if (formDataNewPassword?.password.length < 9 && formDataNewPassword?.cpassword.length < 9) {
        setLoading(false);
        setError(true);
        setErrorAnimation(true);
        setErrorMessage("Please enter at least 8 letters or numbers.");
        setTimeout(() => {
          setError(false);
          setErrorAnimation(false);
        }, 3000);
      } else {
        fetch("/api/auth/update-password", {
          method: "POST",
          body: JSON.stringify({
            email: formData?.email,
            password: formDataNewPassword?.password,
          }),
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            setLoading(false);
            if (data?.status === 200) {
              setSuccess(true);
              setSuccessMessage("Password has been updated.");
              setSuccessAnimation(true);                            
              setLoading(false);
              setTimeout(() => {
                setSuccess(false);
                setSuccessAnimation(false);
                route.push("/account/login");
              }, 3000);
            } else if (data?.status === 403) {
              setError(true);
              setErrorMessage("You are using your current password.");
              setErrorAnimation(true);
              setFormDataOTP(" ");
              setLoading(false);
              setTimeout(() => {
                setError(false);
                setErrorAnimation(false);
              }, 3000);
            } else if (data?.status === 440) {
              setError(true);
              setErrorMessage("Your Session is expired. Please try again.");
              setErrorAnimation(true);
              setFormDataOTP(" ");
              setLoading(false);
              setTimeout(() => {
                setError(false);
                setErrorAnimation(false);
                setFormData(' ');
                setFormShow('form')
              }, 3000);
            }
          });
      }
    } else {
      setLoading(false);
      setError(true);
      setErrorAnimation(true);
      setErrorMessage("Password and confirm password is not matching.");
      setTimeout(() => {
        setError(false);
        setErrorAnimation(false);
      }, 3000);
    }
  };
  return (
    <>
      {formShow === "form" && (
        <>
          <H1
            tag={true}
            className="text-white max-w-[450px] text-center mt-[176px] mb-[15px]"
          >
            Forgot Password
          </H1>
          <form
            className="max-w-[500px] w-full flex flex-col gap-[15px]"
            onSubmit={submitForm}
          >
            <Input
              name="email"
              value={formData?.email || ''}
              type="email"
              setData={setFormValues}
              required
              placeholder="Email Address"
            >
              <IconMail size="24px" color="fill-[#C2C3CB]" />
            </Input>
            <FormButton
              type="submit"
              label="Send OTP"
              btnType="solid"
              loading={loading}
              loadingText="Sending OTP..."
            />
            <Text className="text-center font-poppins text-sm font-medium text-white flex flex-col gap-4">
              or{" "}
              <span>
                {" "}
                <FormButton
                  event={forgotPassword}
                  label="Sign In"
                  type="button"
                  btnType="link"
                />
              </span>
            </Text>
          </form>
        </>
      )}
      {formShow === "otp" && (
        <>
          <H1
            tag={true}
            className="text-white max-w-[450px] text-center mt-[176px] mb-[15px]"
          >
            Enter OTP
          </H1>
          <form
            className="max-w-[500px] w-full flex flex-col gap-[15px] "
            onSubmit={forgotPasswordOTP}
          >
            <div
              className="flex gap-[5px] justify-center mb-[15px]"
              ref={otpRef}
            >
              <input
                onKeyUp={() => tabChange(1)}
                maxLength="1"
                type="number"
                name="opt1"
                value={formDataOTP?.opt1 || ''}
                onInput={setOTPFormValues}
                className="w-14 h-14 border-2 rounded-lg border-white text-center bg-transparent text-white"
              />
              <input
                onKeyUp={() => tabChange(2)}
                maxLength="1"
                type="number"
                name="opt2"
                value={formDataOTP?.opt2 || ''}
                onInput={setOTPFormValues}
                className="w-14 h-14 border-2 rounded-lg border-white text-center bg-transparent text-white"
              />
              <input
                onKeyUp={() => tabChange(3)}
                maxLength="1"
                type="number"
                name="opt3"
                value={formDataOTP?.opt3 || ''}
                onInput={setOTPFormValues}
                className="w-14 h-14 border-2 rounded-lg border-white text-center bg-transparent text-white"
              />
              <input
                onKeyUp={() => tabChange(4)}
                maxLength="1"
                type="number"
                name="opt4"
                value={formDataOTP?.opt4 || ''}
                onInput={setOTPFormValues}
                className="w-14 h-14 border-2 rounded-lg border-white text-center bg-transparent text-white"
              />
            </div>
            <FormButton
              type="submit"
              label="Verify"
              btnType="solid"
              loading={loadingOTP}
              loadingText="Verifing..."
            />
            <Wrapper className="text-center">
              {" "}
            {!resend && ( <FormButton
                event={resendMail}
                label="Resend"
                type="button"
                btnType="link"
              />) } 
            { resend && ( <Text className="text-white">
              {resendMessage === 'resend' && (`Please wait for ${formatTime(seconds)} minutes before trying again.`)}
              {resendMessage === 'otp' && (`OTP is vaild for ${formatTime(seconds)} minutes.`)}                               
              </Text>) } 
            </Wrapper>
          </form>
        </>
      )}
      {formShow === "newPassword" && (
        <>
          <H1
            tag={true}
            className="text-white max-w-[450px] text-center mt-[176px] mb-[15px]"
          >
            New password
          </H1>
          <form
            className="max-w-[500px] w-full flex flex-col gap-[15px]"
            onSubmit={newPassword}
          >
            <Wrapper>
              <label className="text-white mb-2 block">Password</label>
              <Password
                name="password"
                required
                setData={setNewFormData}
                value={formDataNewPassword?.password || ""}
              >
                <IconLock size="24px" color="fill-[#C2C3CB]" />
              </Password>
            </Wrapper>
            <Wrapper>
              <label className="text-white mb-2 block">Confirm Password</label>
              <Password
                name="cpassword"
                required
                setData={setNewFormData}
                value={formDataNewPassword?.cpassword || ""}
              >
                <IconLock size="24px" color="fill-[#C2C3CB]" />
              </Password>
            </Wrapper>
            <FormButton
              type="submit"
              label="Submit"
              btnType="solid"
              loading={loading}
              loadingText="Submiting..."
            />
          </form>
        </>
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

export default ForgotPassword;
