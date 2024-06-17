"use client";

import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import ProfileImage from "../Image/ProfileImage";
import useAuth from "@/app/contexts/Auth/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import H3 from "@/app/components/Ui/H3/H3";
import Text from "@/app/components/Ui/Text/Text";
import { formatDate } from "@/app/utils/DateFormat";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import Modal from "@/app/components/Ui/Modal/Modal";
import Password from "@/app/components/Form/Password/Password";
import IconLock from "@/app/components/Icons/IconLock";
import Notification from "@/app/components/Ui/notification/success/Notification";
import ErrorNotification from "@/app/components/Ui/notification/loader/LoaderNotification";
import SkeletonLoader from "@/app/components/Ui/skeletonLoader/skeletonLoader";

const ProfileLeft = () => {
  const { userData, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [forgotPasswordHide, setForgotPasswordHide] = useState(false);
  const [formDataNewPassword, setFormDataNewPassword] = useState({});
  const [success, setSuccess] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAnimation, setErrorAnimation] = useState(false);
  const [formData, setFormData] = useState({});
  const changeCoverImage = async (e) => {
    setLoading(true);
    const reader = new FileReader();
    const random = Math.floor(Math.random() * 1000000 + 1);
    reader.readAsDataURL(e.target.files[0]);
    const formData = new FormData();
    formData.append("folder", userData?.userID);
    formData.append(
      "name",
      userData?.userID + "-" + random + "-profile-image.jpg"
    );
    formData.append("file", e.target.files[0]);
    const imageUrl_ = URL.createObjectURL(e.target.files[0]);
    setCoverImage(imageUrl_);
    const response = await axios
      .post("https://thefabcode.org/hr-portal/upload.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (res) => {
        await fetch("/api/dashboard/profile/cover", {
          method: "POST",
          body: JSON.stringify({
            email: userData?.email,
            profileImage: res.data?.url,
            profileImageLabel: "profileImage",
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            setUserData(res);
            setLoading(false);
          });
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const forgotPassword = (e) => {};
  const openModal = (e) => {
    setForgotPasswordHide(e);
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
      if (
        formDataNewPassword?.password.length < 8 &&
        formDataNewPassword?.cpassword.length < 8
      ) {
        setLoading(false);
        setError(true);
        setErrorAnimation(true);
        setErrorMessage("Please enter at least 8 letters or numbers.");
        setTimeout(() => {
          setError(false);
          setErrorAnimation(false);
        }, 3000);
      } else {
        fetch("/api/auth/update-user-password", {
          method: "POST",
          body: JSON.stringify({
            email: userData?.email,
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
                setForgotPasswordHide(false)
                setSuccess(false);
                setSuccessAnimation(false);
              }, 3000);
            } else if (data?.status === 403) {
              setError(true);
              setErrorMessage("You are using your current password.");
              setErrorAnimation(true);
              setLoading(false);
              setTimeout(() => {
                setError(false);
                setErrorAnimation(false);
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
    <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col max-w-[360px] w-full">
      <Wrapper className=" flex justify-center">
        <Wrapper className={`relative ${loading ? "animate-pulse" : ""}`}>
          <ProfileImage size={144} />
          <label
            htmlFor="profileImageInput"
            className="absolute right-[19px] top-0 cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="11"
                fill="#B2A6FF"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M17.25 12.75H12.75V17.25H11.25V12.75H6.75V11.25H11.25V6.75H12.75V11.25H17.25V12.75Z"
                fill="white"
              />
            </svg>
          </label>
        </Wrapper>
        <input
          id="profileImageInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={changeCoverImage}
        />
      </Wrapper>
     
      {!userData && <SkeletonLoader className='!w-1/2 rounded-2xl !h-[27px] mx-auto mt-[5px]'/>}
          {userData &&  <H3 className="text-center mt-[5px]">{userData?.name}</H3>
}
      <Wrapper className="mt-[15px]">
        <Wrapper className="py-[10px] border-t border-b border-light-500 flex justify-between items-center">
          <Text className="!text-light-400 flex-1">Designation</Text>
          {!userData && <SkeletonLoader className='!w-1/2 rounded-2xl !h-3'/>}
         {userData &&  <Text className="flex-1 text-right capitalize">
            {userData?.designation}
          </Text>}
        </Wrapper>
        <Wrapper className="py-[10px]  border-b border-light-500 flex justify-between  items-center">
          <Text className="!text-light-400 flex-1">Department</Text>
          {!userData && <SkeletonLoader className='!w-1/2 rounded-2xl !h-3'/>}
          {userData &&   <Text className="flex-1 text-right capitalize">
            {userData?.department}
          </Text> }
        </Wrapper>
        <Wrapper className="py-[10px]  border-b border-light-500 flex justify-between  items-center">
          <Text className="!text-light-400 flex-1">Join Date</Text>
          {!userData && <SkeletonLoader className='!w-1/2 rounded-2xl !h-3'/>}
          {userData && 
          <Text className="flex-1 text-right capitalize">
            {formatDate(userData?.joinDate)}
          </Text>
}
        </Wrapper>
      </Wrapper>
      <Wrapper className="mt-[15px]">
        <FormButton
          event={openModal}
          type="button"
          label="Change Password"
          btnType="solid"
          additionalCss="max-w-[250px] mx-auto block"
        />
      </Wrapper>
      {forgotPasswordHide && (
        <Modal
          opened={forgotPasswordHide}
          hideModal={openModal}
          heading={"Forgot Password"}
        >
          <Wrapper className="max-w-[510px] m-auto">
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
                <label className="text-white mb-2 block">
                  Confirm Password
                </label>
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

export default ProfileLeft;
