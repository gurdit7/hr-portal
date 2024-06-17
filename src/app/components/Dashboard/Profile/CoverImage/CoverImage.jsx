"use client";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import Image from "next/image";
import Cover from "../../../../assets/images/profile/cover.jpg";
import { useEffect, useState } from "react";
import useAuth from "@/app/contexts/Auth/auth";
import axios from "axios";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";

const CoverImage = () => {
  const { userData, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(Cover.src);
  const { setBreadcrumbs } = useThemeConfig();
  useEffect(() => {
    const breadcrumbs = [
      {
        href: "/dashboard/profile",
        label: "My Profile",
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, []);
  useEffect(() => {
    setCoverImage(userData?.coverImage);
  }, [userData]);
  const changeCoverImage = async (e) => {
    setLoading(true);
    const reader = new FileReader();
    const random = Math.floor(Math.random() * 1000000 + 1);
    reader.readAsDataURL(e.target.files[0]);
    const formData = new FormData();
    formData.append("folder", userData?.userID);
    formData.append(
      "name",
      userData?.userID + "-" + random + "-cover-image.jpg"
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
            coverImage: res.data?.url,
            profileImageLabel: "coverImage",
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
  return (
    <Wrapper className="w-full relative">
      <Wrapper
        className={`${
          loading ? "animate-pulse" : ""
        } w-full h-[200px] bg-white rounded-xl`}
      >
        <Image
          src={coverImage || Cover.src}
          width={Cover.width}
          height={Cover.height}
          className={` duration-300 w-full h-[200px] object-cover object-center rounded-xl `}
          alt={"cover Image"}
        />
      </Wrapper>

      <label
        htmlFor="coverImageInput"
        className="absolute rounded-3xl top-[10px] right-[10px] border border-bg py-[5px] px-[15px] text-bg text-bases cursor-pointer
    hover:bg-bg hover:text-dark-blue
    "
      >
        Change Cover
      </label>
      <input
        id="coverImageInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={changeCoverImage}
      />
    </Wrapper>
  );
};

export default CoverImage;
