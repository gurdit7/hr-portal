"use client";
import { useState } from "react";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import Text from "../../Ui/Text/Text";
import H3 from "../../Ui/H3/H3";
import { formatDate } from "@/app/utils/DateFormat";
import Link from "next/link";

export const toHTML = (ref, content, limit) => {
  if (ref.current) {
    ref.current.innerHTML = content.substring(0, limit);
  }
};

const Item = ({ item }) => {
  const [load, setLoad] = useState(false);
  const [status, setStatus] = useState(false);
  const click = async (id) => {
    setStatus(true);
    try {
      const viewedStatus = item?.viewed.map((mail) => {
        if (mail?.mail === userData?.email) {
          return { mail: mail?.mail, status: true };
        } else {
          return { mail: mail?.mail, status: false };
        }
      });
      const response = await fetch("/api/dashboard/notifications", {
        method: "PUT",
        body: JSON.stringify({
          id: id,
          viewed: viewedStatus,
        }),
      });
      const result = await response.json();
      setLoad(true);
    } catch (error) {}
  };
  return (
    <Wrapper
      className={`border rounded-lg border-light-500 relative ${
        !item?.viewedStatus ? "border-l-4 border-green-600" : " "
      }`}
    >
      <div
        className="p-[10px] flex items-center gap-3"
        onClick={() => click(item?._id)}
      >
        <Wrapper className="w-10 h-10 border rounded-full bg-accent flex justify-center items-center text-white font-semibold text-xl">
          {item.name.slice(0, 1)}
        </Wrapper>
        {item?.type === "leaveRequest" && (
          <Text>{item.name} is requested for leave.</Text>
        )}
        {item?.type === "document" && (
          <Text>{item.name} is requested for leave.</Text>
        )}        
        {item?.type === "appraisalForm" && (
          <Text>{item.name} is requested for appraisal.</Text>
        )}
        {item?.link && (
          <Link
            href={item?.link}
            className="opacity-0 absolute top-0 left-0 w-full h-full"
          ></Link>)}

      </div>
    </Wrapper>
  );
};

export default Item;
