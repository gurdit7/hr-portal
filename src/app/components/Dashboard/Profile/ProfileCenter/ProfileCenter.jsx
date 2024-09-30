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
import SkeletonLoader from "@/app/components/Ui/skeletonLoader/skeletonLoader";
import useAuth from "@/app/contexts/Auth/auth";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import { formatDate } from "@/app/utils/DateFormat";
import { useEffect, useState } from "react";

const ProfileCenter = () => {
  const { userData, setUserData } = useAuth();
  const {userPermissions} = useDashboard();
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
  useEffect(() => {
    if (userData) {
      setFormData({
        key: `${userData?._id}`,
        personalEmail: userData?.personalEmail,
        currentAddress: userData?.currentAddress,
        permanentAddress: userData?.permanentAddress,
        phoneNumber: userData?.phoneNumber,
        accountNumber: userData?.accountNumber,
        IFSC: userData?.IFSC,
      });
    }
  }, [userData]);
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
      if (userData?.email === formData[item]) {
        newErrorState[item] = "matched";
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
    setLoading(true);
    fetch("/api/dashboard/employee", {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error) {
          setError({
            status: true,
            active: true,
            message: res?.error,
          });
          setTimeout(() => {
            setLoading(false);
            setError(false);
          }, 3000);
        } else {
          setUserData(res);
          setSuccess(true);
          setSuccessMessage("Profile Successfully Updated.");
          setSuccessAnimation(true);
          setTimeout(() => {
            setLoading(false);
            setForgotPasswordHide(false);
            setSuccess(false);
            setSuccessAnimation(false);
          }, 3000);
        }
      })
      .catch((error) => {
        setError({
          status: true,
          active: true,
          message: error?.error,
        });
        setTimeout(() => {
          setLoading(false);
          setError(false);
        }, 3000);
      });
  };
  const setBankBack = () => {
    setBankAccount(false);
  };
  return (
    <Wrapper className="p-5 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-[10px] flex flex-col w-full">
      <H2>Personal Information</H2>
      <Wrapper className="mt-[15px]">
        <Wrapper className="py-[10px] border-t border-b dark:border-gray-600 border-light-500 gap-x-4 flex justify-between">
          <Text className="!text-light-400 flex-1">Email</Text>
          {!userData && <SkeletonLoader className="!w-1/2 rounded-2xl !h-3" />}
          {userData && (
            <Text className="flex-1 text-right ">{userData?.email}</Text>
          )}
        </Wrapper>
        <Wrapper className="py-[10px] border-b dark:border-gray-600 border-light-500 gap-x-4 flex justify-between">
          <Text className="!text-light-400 flex-1">Personal Email</Text>
          {!userData && <SkeletonLoader className="!w-1/2 rounded-2xl !h-3" />}
          {userData && (
            <Text className="flex-1 text-right ">
              {userData?.personalEmail || "Not Added"}
            </Text>
          )}
        </Wrapper>
        <Wrapper className="py-[10px]  border-b dark:border-gray-600 border-light-500 gap-x-4 flex justify-between">
          <Text className="!text-light-400 flex-1">Date of Birth</Text>
          {!userData && <SkeletonLoader className="!w-1/2 rounded-2xl !h-3" />}
          {userData && (
            <Text className="flex-1 text-right capitalize">
              {formatDate(userData?.DOB)}
            </Text>
          )}
        </Wrapper>
        <Wrapper className="py-[10px]  border-b dark:border-gray-600 border-light-500 gap-x-4 flex justify-between">
          <Text className="!text-light-400 flex-1">Current Address</Text>
          {!userData && (
            <>
              <Wrapper className="flex-1 flex gap-2 justify-end flex-col items-end">
                <SkeletonLoader className="!w-full rounded-2xl !h-3" />
                <SkeletonLoader className="!w-10/12 rounded-2xl !h-3" />
                <SkeletonLoader className="!w-8/12 rounded-2xl !h-3" />
              </Wrapper>
            </>
          )}
          {userData && (
            <Text className="flex-1 text-right capitalize">
              {userData?.currentAddress || "Not Added Yet"}
            </Text>
          )}
        </Wrapper>
        <Wrapper className="py-[10px] border-b dark:border-gray-600 border-light-500 gap-x-4 flex justify-between">
          <Text className="!text-light-400 flex-1">Permanent Address</Text>
          {!userData && (
            <>
              <Wrapper className="flex-1 flex gap-2 justify-end flex-col items-end">
                <SkeletonLoader className="!w-full rounded-2xl !h-3" />
                <SkeletonLoader className="!w-10/12 rounded-2xl !h-3" />
                <SkeletonLoader className="!w-8/12 rounded-2xl !h-3" />
              </Wrapper>
            </>
          )}
          {userData && (
            <Text className="flex-1 text-right capitalize">
              {userData?.permanentAddress || "Not Added Yet"}
            </Text>
          )}
        </Wrapper>
        <Wrapper className="py-[10px] border-b dark:border-gray-600 border-light-500 gap-x-4 flex justify-between">
          <Text className="!text-light-400 flex-1">Phone Number</Text>
          {!userData && <SkeletonLoader className="!w-1/2 rounded-2xl !h-3" />}
          {userData && (
            <Text className="flex-1 text-right capitalize">
              {userData?.phoneNumber || "Not Added Yet"}
            </Text>
          )}
        </Wrapper>
      </Wrapper>

      <H2 className="mt-[15px]">Bank Account Details</H2>
      <Wrapper className="mt-[15px]">
        <Wrapper className="py-[10px] border-t border-b dark:border-gray-600 border-light-500 gap-x-4 flex justify-between">
          <Text className="!text-light-400 flex-1">Account Number</Text>
          {!userData && <SkeletonLoader className="!w-1/2 rounded-2xl !h-3" />}
          {userData && (
            <Text className="flex-1 text-right capitalize">
              {userData?.accountNumber || "Not Added Yet"}
            </Text>
          )}
        </Wrapper>
        <Wrapper className="py-[10px]  border-b dark:border-gray-600 border-light-500 gap-x-4 flex justify-between">
          <Text className="!text-light-400 flex-1">IFSC Code</Text>
          {!userData && <SkeletonLoader className="!w-1/2 rounded-2xl !h-3" />}
          {userData && (
            <Text className="flex-1 text-right capitalize">
              {userData?.IFSC || "Not Added Yet"}
            </Text>
          )}
        </Wrapper>
      </Wrapper>
      {userPermissions && userPermissions.includes('write-profile') && 
      <Wrapper className="mt-[15px]">
        <FormButton
          event={openModal}
          type="button"
          label="Edit Profile"
          btnType="solid"
          additionalCss="max-w-[250px] mx-auto block"
        />
      </Wrapper>
}
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
                    <Text className="!text-red-400 p-1">
                      This field is required
                    </Text>
                  )}
                  {__error?.personalEmail === "matched" && (
                    <Text className="!text-red-400 p-1 ">
                      Please enter a different email from official email.
                    </Text>
                  )}
                </Wrapper>
                <Wrapper>
                  <Input
                    placeholder="Current Address"
                    required={true}
                    value={formData?.currentAddress || ""}
                    type="text"
                    name="currentAddress"
                    setData={setValues}
                  >
                    <Wrapper className="mt-[-3px]">
                      <IconHome size="24px" color="fill-[#C2C3CB]" />
                    </Wrapper>
                  </Input>
                  {__error?.currentAddress && (
                    <Text className="!text-red-400 p-1">
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
                    <Text className="!text-red-400 p-1">
                      This field is required
                    </Text>
                  )}
                </Wrapper>
                <Wrapper>
                  <Input
                    placeholder="Phone Number"
                    required={true}
                    value={formData?.phoneNumber || ""}
                    type="tel"
                    name="phoneNumber"
                    setData={setValues}
                  >
                    <Wrapper className="mt-[-3px]">
                      <IconTel size="24px" color="fill-[#C2C3CB]" />
                    </Wrapper>
                  </Input>
                  {__error?.phoneNumber && (
                    <Text className="!text-red-400 p-1">
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
              <form
                className="max-w-[500px] w-full flex flex-col gap-[15px]"
                onSubmit={submitForm}
              >
                <Wrapper>
                  <Input
                    placeholder="Account Number"
                    required={true}
                    value={formData?.accountNumber || ""}
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
                    value={formData?.IFSC || ""}
                    type="text"
                    name="IFSC"
                    setData={setValues}
                  >
                    <Wrapper className="mt-[-3px]">
                      <IconAccountBalance size="24px" color="fill-[#C2C3CB]" />
                    </Wrapper>
                  </Input>
                </Wrapper>
                <Wrapper className="flex gap-2">
                  <Wrapper className="flex-1">
                    <FormButton
                      type="button"
                      event={setBankBack}
                      btnType="outlined"
                      additionalCss="gap-x-4 flex justify-between px-5 items-center group h-full"
                    >
                      Back{" "}
                      <IconArrowBackword
                        size="18"
                        color="fill-accent group-hover:fill-white"
                      />
                    </FormButton>
                  </Wrapper>
                  <Wrapper className="flex-1">
                    <FormButton
                      type="submit"
                      label="Save"
                      btnType="solid"
                      loading={loading}
                      loadingText="Saving..."
                    ></FormButton>
                  </Wrapper>
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
          {error?.status && (
            <ErrorNotification
              active={error?.active}
              message={error?.message}
            ></ErrorNotification>
          )}
        </Modal>
      )}
    </Wrapper>
  );
};

export default ProfileCenter;
