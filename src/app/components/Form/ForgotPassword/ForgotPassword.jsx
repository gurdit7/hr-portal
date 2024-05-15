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
const ForgotPassword = () => {
  const route = useRouter();
  const [formData, setFormData] = useState({});
  const [formDataOTP, setFormDataOTP] = useState({});
  const [success, setSuccess] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAnimation, setErrorAnimation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formShow, setFormShow] = useState('otp');
  const otpRef = useRef("");
  const generateOTP = (limit) => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < limit; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  };
  const setFormValues = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const setOTPFormValues = (e) => {
    if(e.target.value.length > 1){

    }
    else{
    setFormDataOTP({
      ...formDataOTP,
      [e.target.name]: e.target.value,
    });
  }
  };
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
        setSuccessAnimation(true);
        alert();
        fetch("/api/auth/send-otp", {
          method: "POST",
          body: JSON.stringify({ email: formData?.email, otp: otp }),
        })
          .then(function (res) {
            return res;
          })
          .then(function (data) {
            if (data.status === 200) {
              setSuccess(false);
              setSuccessAnimation(false);  
              setFormShow('otp');
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
    }
    else if(ele[val-1].value == ''  && val !== 1){
      ele[val-2].focus()
    } 
  };
  const forgotPasswordOTP = (e)=>{
    e.preventDefault();
    fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({email:formData?.email,otp:formDataOTP?.opt1+formDataOTP?.opt2+formDataOTP?.opt3+formDataOTP?.opt4}),
    })
      .then(function (res) {
        return res;
      })
      .then(function (data) {
          
      });
  }
  return (
    <>
      {formShow === 'otp' && (
        <>
          <H1 tag={true} className='text-white max-w-[450px] text-center mt-[176px] mb-[15px]'>
          Forgot Password
          </H1>
        <form
          className="max-w-[500px] w-full flex flex-col gap-[15px]"
          onSubmit={submitForm}
        >
          <Input
            name="email"
            value={formData?.email}
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
      {formShow === 'otp' && (
        <>
          <H1 tag={true} className='text-white max-w-[450px] text-center mt-[176px] mb-[15px]'>
      Enter OTP
      </H1>
        <form
          className="max-w-[500px] w-full flex flex-col gap-[15px] "
          onSubmit={forgotPasswordOTP}
        >
          <div className="flex gap-[5px] justify-center mb-[15px]" ref={otpRef}>
            <input
              onKeyUp={() => tabChange(1)}
              maxlength="1"
              type="number"
              name="opt1"
              value={formDataOTP?.opt1}
              onInput={setOTPFormValues}
              className="w-14 h-14 border-2 rounded-lg border-white text-center bg-transparent text-white"
            />
            <input
              onKeyUp={() => tabChange(2)}
              maxlength="1"
              type="number"
              name="opt2"
              value={formDataOTP?.opt2}
              onInput={setOTPFormValues}
              className="w-14 h-14 border-2 rounded-lg border-white text-center bg-transparent text-white"
            />
            <input
              onKeyUp={() => tabChange(3)}
              maxlength="1"
              type="number"
              name="opt3"
              value={formDataOTP?.opt3}
              onInput={setOTPFormValues}
              className="w-14 h-14 border-2 rounded-lg border-white text-center bg-transparent text-white"
            />
            <input
              onKeyUp={() => tabChange(4)}
              maxlength="1"
              type="number"
              name="opt4"
              value={formDataOTP?.opt4}
              onInput={setOTPFormValues}
              className="w-14 h-14 border-2 rounded-lg border-white text-center bg-transparent text-white"
            />
          </div>
          <FormButton
            type="submit"
            label="Verify"
            btnType="solid"
            loading={loading}
            loadingText="Verifing..."
          />
           <Wrapper className='text-center'>
              {" "}
              <FormButton
                event={forgotPasswordOTP}
                label="Resend"
                type="button"
                btnType="link"
              />
            </Wrapper>
        </form>
        </>
      )}
      {success && (
        <Notification
          active={successAnimation}
          message="Email is Successfully sent"
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
