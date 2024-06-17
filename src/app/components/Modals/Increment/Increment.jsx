"use client";
import useAuth from "@/app/contexts/Auth/auth";
import { useEffect, useState } from "react";
import Image from "next/image";
import Img from "../../../sdf.gif";
import Wrapper from "../../Ui/Wrapper/Wrapper";

const Increment = () => {
  const { userData } = useAuth();
  const [isBirthday, setIsBirthday] = useState(false);
  const [name, setName] = useState("");
  const [imageVisible, setImageVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const checkBirthday = () => {
      const today = new Date();
      const userDOB = new Date(userData?.joinDate);
      const hideBirthday = localStorage.getItem("incrementHide");

      if (userDOB.getDate() === today.getDate() && userDOB.getMonth() === today.getMonth()) {
        if (!hideBirthday || hideBirthday === "false") {
          setIsBirthday(true);
          localStorage.setItem("incrementHide", "false");
          setTimeout(() => setImageVisible(false), 3500);
          setTimeout(() => {
            setIsBirthday(false);
            localStorage.setItem("incrementHide", "true");
          }, 5000);
        }
      }
    };

    setName(userData?.name);
    checkBirthday();
  }, [userData]);

  useEffect(() => {
    if (isBirthday) {
      setTimeout(() => setModalVisible(true), 100);
    }
  }, [isBirthday]);

  return (
    <>
      {isBirthday && (
        <Wrapper
          className={`fixed top-0 left-0 z-[999] w-full h-full flex justify-center items-center duration-500 ${
            modalVisible ? "opacity-1 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <Wrapper className="relative z-20 w-full">
            <Image
              src={Img.src}
              width={Img.width}
              alt="Birthday celebration"
              height={Img.height}
              className={`duration-500 ${imageVisible ? 'opacity-100' : 'opacity-0'}`}
            />
            <Wrapper
              className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 duration-500 ${
                imageVisible ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <Wrapper className="stroke-text text-7xl font-bold uppercase text-center">
                Happy Work Anniversary
              </Wrapper>
              <Wrapper className="text-7xl font-bold uppercase text-center">
                {name}
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      )}
    </>
  );
};

export default Increment;
