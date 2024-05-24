"use client";

import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconAccountBalance from "@/app/components/Icons/IconAccountBalance";
import IconArrowBackword from "@/app/components/Icons/IconArrowBackword";
import IconArrowForward from "@/app/components/Icons/IconArrowForward";
import IconHome from "@/app/components/Icons/IconHome";
import IconMail from "@/app/components/Icons/IconMail";
import IconTag from "@/app/components/Icons/IconTag";
import IconTel from "@/app/components/Icons/IconTel";
import H2 from "@/app/components/Ui/H2/H2";
import Modal from "@/app/components/Ui/Modal/Modal";
import Text from "@/app/components/Ui/Text/Text";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import ErrorNotification from "@/app/components/Ui/notification/loader/LoaderNotification";
import Notification from "@/app/components/Ui/notification/success/Notification";
import useAuth from "@/app/contexts/Auth/auth";
import { formatDate } from "@/app/utils/DateFormat";
import { useEffect, useState } from "react";

const ProfileCenter = () => {
  const { userData, setUserData } = useAuth();
  const [formData, setFormData] = useState({});
  const [__error, setErrorForm] = useState({});
  const [forgotPasswordHide, setForgotPasswordHide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankAccount, setBankAccount] = useState(false);
  const [modalHeading, setModalHeading] = useState("Edit Profile");
  const [success, setSuccess] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAnimation, setErrorAnimation] = useState(false);
  useEffect(()=>{
    setFormData({
        personalEmail:userData?.personalEmail,
        currentAddress:userData?.currentAddress,
        permanentAddress:userData?.permanentAddress,
        phoneNumber:userData?.phoneNumber,
        accountNumber:userData?.accountNumber,
        IFSC:userData?.IFSC  
    })
  },[userData])
  const openModal = (e) => {
    setBankAccount(false);
    setForgotPasswordHide(e);
  };
  const setValues = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const setBank = (e) => {
    setFormData({
        ...formData,
        email: userData?.email,
      });
    const fields = [
      "personalEmail",
      "currentAddress",
      "permanentAddress",
      "phoneNumber",
    ];
    const newErrorState = { ...__error };
    fields.forEach((item) => {
      newErrorState[item] = !formData[item];
      if(userData?.email === formData[item]){
        newErrorState[item] = 'matched';
    }
    });
    setErrorForm(newErrorState);
    if (
      !newErrorState?.personalEmail &&
      !newErrorState?.currentAddress &&
      !newErrorState?.permanentAddress &&
      !newErrorState?.phoneNumber
    ) {
      setBankAccount(true);
      setModalHeading("Bank Account Details");
    }
  };
  const submitForm = (e) => {   
    
        e.preventDefault();
        fetch('/api/dashboard/add-employee',{
            method:"PUT",
            body:JSON.stringify(formData)

        }).then((res)=>{
            return res.json()
        }).then((res)=>{
            setUserData(res)
            setSuccess(true);
            setSuccessMessage("Profile Successfully Updated.");
            setSuccessAnimation(true);
            setTimeout(() => {
                setForgotPasswordHide(false);
                setSuccess(false);
                setSuccessAnimation(false);
              }, 3000);
        })
  };
  const setBankBack = ()=>{
    setBankAccount(false);
  }
  return (
    <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col w-full">
      <H2>Personal Information</H2>
      <Wrapper className="mt-[15px]">
        <Wrapper className="py-[10px] border-t border-b border-light-500 flex justify-between">
          <Text className="!text-light-400 flex-1">Email</Text>
          <Text className="flex-1 text-right ">{userData?.email}</Text>
        </Wrapper>
        <Wrapper className="py-[10px] border-b border-light-500 flex justify-between">
          <Text className="!text-light-400 flex-1">Personal Email</Text>
          <Text className="flex-1 text-right ">
            {userData?.personalEmail || "Not Added"}
          </Text>
        </Wrapper>
        <Wrapper className="py-[10px]  border-b border-light-500 flex justify-between">
          <Text className="!text-light-400 flex-1">Date of Birth</Text>
          <Text className="flex-1 text-right capitalize">
            {formatDate(userData?.DOB)}
          </Text>
        </Wrapper>
        <Wrapper className="py-[10px]  border-b border-light-500 flex justify-between">
          <Text className="!text-light-400 flex-1">Current Address</Text>
          <Text className="flex-1 text-right capitalize">
            {userData?.currentAddress || "Not Added Yet"}
          </Text>
        </Wrapper>
        <Wrapper className="py-[10px] border-b border-light-500 flex justify-between">
          <Text className="!text-light-400 flex-1">Permanent Address</Text>
          <Text className="flex-1 text-right capitalize">
            {userData?.permanentAddress || "Not Added Yet"}
          </Text>
        </Wrapper>
        <Wrapper className="py-[10px] border-b border-light-500 flex justify-between">
          <Text className="!text-light-400 flex-1">Phone Number</Text>
          <Text className="flex-1 text-right capitalize">
            {userData?.phoneNumber || "Not Added Yet"}
          </Text>
        </Wrapper>
      </Wrapper>

      <H2 className="mt-[15px]">Bank Account Details</H2>
      <Wrapper className="mt-[15px]">
        <Wrapper className="py-[10px] border-t border-b border-light-500 flex justify-between">
          <Text className="!text-light-400 flex-1">Account Number</Text>
          <Text className="flex-1 text-right capitalize">
            {userData?.accountNumber || "Not Added Yet"}
          </Text>
        </Wrapper>
        <Wrapper className="py-[10px]  border-b border-light-500 flex justify-between">
          <Text className="!text-light-400 flex-1">IFSC Code</Text>
          <Text className="flex-1 text-right capitalize">
            {userData?.IFSC || "Not Added Yet"}
          </Text>
        </Wrapper>
      </Wrapper>
      <Wrapper className="mt-[15px]">
        <FormButton
          event={openModal}
          type="button"
          label="Edit Profile"
          btnType="solid"
          additionalCss="max-w-[250px] mx-auto block"
        />
      </Wrapper>
      {forgotPasswordHide && (
        <Modal
          opened={forgotPasswordHide}
          hideModal={openModal}
          heading={modalHeading}
        >
          <Wrapper className="max-w-[510px] m-auto">
            {!bankAccount && (
              <form className="max-w-[500px] w-full flex flex-col gap-[15px]">
                <Wrapper>
                  <Input
                    placeholder="Personal Email"
                    required={true}
                    value={formData?.personalEmail || ""}
                    type="email"
                    name="personalEmail"
                    setData={setValues}
                  >
                    <Wrapper className="mt-[-3px]">
                      <IconMail size="24px" color="fill-[#C2C3CB]" />
                    </Wrapper>
                  </Input>
                  {__error?.personalEmail === true && (
                    <Text className="text-red-200 p-1">
                      This field is required
                    </Text>
                  )}
                  {__error?.personalEmail === 'matched' && (
                    <Text className="text-red-200 p-1 ">
                      Please enter a different email from official email.
                    </Text>
                  )}
                </Wrapper>
                <Wrapper>
                  <Input
                    placeholder="Current Address"
                    required={true}
                    value={formData?.currentAddress  || ""}
                    type="text"
                    name="currentAddress"
                    setData={setValues}
                  >
                    <Wrapper className="mt-[-3px]">
                      <IconHome size="24px" color="fill-[#C2C3CB]" />
                    </Wrapper>
                  </Input>
                  {__error?.currentAddress && (
                    <Text className="text-red-200 p-1">
                      This field is required
                    </Text>
                  )}
                </Wrapper>
                <Wrapper>
                  <Input
                    placeholder="Permanent Address"
                    required={true}
                    value={formData?.permanentAddress || ""}
                    type="text"
                    name="permanentAddress"
                    setData={setValues}
                  >
                    <Wrapper className="mt-[-3px]">
                      <IconHome size="24px" color="fill-[#C2C3CB]" />
                    </Wrapper>
                  </Input>
                  {__error?.permanentAddress && (
                    <Text className="text-red-200 p-1">
                      This field is required
                    </Text>
                  )}
                </Wrapper>
                <Wrapper>
                  <Input
                    placeholder="Phone Number"
                    required={true}
                    value={formData?.phoneNumber  || ""}
                    type="tel"
                    name="phoneNumber"
                    setData={setValues}
                  >
                    <Wrapper className="mt-[-3px]">
                      <IconTel size="24px" color="fill-[#C2C3CB]" />
                    </Wrapper>
                  </Input>
                  {__error?.phoneNumber && (
                    <Text className="text-red-200 p-1">
                      This field is required
                    </Text>
                  )}
                </Wrapper>
           
                <FormButton
                  type="button"
                  label="Next"
                  event={setBank}
                  btnType="solid"        
                  additionalCss="flex flex-row-reverse justify-between px-5 items-center"
                >
                  <IconArrowForward size="18" color="fill-white" />
                </FormButton>
         
              </form>
            )}
            {bankAccount && (
              <form className="max-w-[500px] w-full flex flex-col gap-[15px]" onSubmit={submitForm}>
                <Wrapper>
                  <Input
                    placeholder="Account Number"
                    required={true}
                    value={formData?.accountNumber  || ""}
                    type="text"
                    name="accountNumber"
                    setData={setValues}
                  >
                    <Wrapper className="mt-[-3px]">
                      <IconTag size="24px" color="fill-[#C2C3CB]" />
                    </Wrapper>
                  </Input>
                </Wrapper>
                <Wrapper>
                  <Input
                    placeholder="IFSC Code"
                    required={true}
                    value={formData?.IFSC  || ""}
                    type="text"
                    name="IFSC"
                    setData={setValues}
                  >
                    <Wrapper className="mt-[-3px]">
                      <IconAccountBalance size="24px" color="fill-[#C2C3CB]" />
                    </Wrapper>
                  </Input>
                </Wrapper>
                <Wrapper className='flex gap-2'>
                <Wrapper className='flex-1'>
            <FormButton
                  type="button"
                  label="Back"
                  event={setBankBack}
                  btnType="outlined"        
           
                  additionalCss="flex justify-between px-5 items-center group h-full"
                >
                  <IconArrowBackword size="18" color="fill-accent group-hover:fill-white" />
                </FormButton>
                </Wrapper>
                <Wrapper className='flex-1'>
                <FormButton
                  type="submit"
                  label="Save"
                  btnType="solid"
                  loading={loading}
                  loadingText="Saving..."
               
                ></FormButton></Wrapper>
                 </Wrapper>
              </form>
            )}
          </Wrapper>
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
        </Modal>
      )}
    </Wrapper>
  );
};

export default ProfileCenter;
