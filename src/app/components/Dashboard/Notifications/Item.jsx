'use client';
import { useEffect, useRef, useState } from "react";
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

const Item = ({ item, emailID, name, userData }) => {  
  const paraRef = useRef();
  const [load, setLoad] = useState(false);
  const [status, setStatus] = useState(false);
  const click = async (id)=>{
    setStatus(true);
    try {
      const viewedStatus = item?.viewed.map(mail => {
        if(mail?.mail === userData?.email){
          return {mail: mail?.mail, status:true}
        }
        else{
          return {mail: mail?.mail, status:false}
        }
      });
      const response = await fetch("/api/dashboard/notifications", {
        method: "PUT",
        body: JSON.stringify({
          id:id,
          viewed:viewedStatus
        }),
      });
     const result =  await response.json();
     setLoad(true)
    } catch (error) {
    }
  }
  useEffect(()=>{
    const viewedStatus = item?.viewed.find(mail => mail?.mail === userData?.email)?.status;
    setStatus(viewedStatus);    
  },[load,userData])
  return (
    <Wrapper className={ `border border-light-500 relative ${!status ? " bg-green-50" : " "}`}>
      <div className="p-[10px]"  onClick={()=>click(item?._id)}>
        {item?.type === 'document' && <Text className="!text-light-400">Document Requested</Text>}
        {item?.type === 'leaves' && <Text className="!text-light-400">Requested Leave</Text>}
        {item?.type === 'appraisalForm' && <Text className="!text-light-400">Requested appraisal</Text>}
        {(item?.type === 'leaves' || item?.type === 'info')  && ( <Link
        href={"/dashboard/leaves/" + item.id}
        className="opacity-0 absolute top-0 left-0 w-full h-full"
      >
      </Link>
)}
        {(item?.type === 'appraisalForm')  && ( <Link
        href={"/dashboard/appraisal/" + item.id}
        className="opacity-0 absolute top-0 left-0 w-full h-full"
      >
      </Link>
)}
        <H3>
          {item?.subject || "Appraisal Request"} 
        </H3>
        {item?.description && (
          <div
            className="mt-[5px] text-sm font-medium font-poppins text-text-dark"
            ref={paraRef}
          >
            {toHTML(paraRef, item?.description, 250)}
          </div>
        )}
        <Wrapper className="flex justify-between items-center border-t border-light-500 pt-[5px] mt-[5px]">
          <Text>{item?.name && "Applied By: " + item?.name}</Text>
          <Text>{formatDate(item?.updatedAt)}</Text>
        </Wrapper>
      </div>    
    </Wrapper>
  );
};

export default Item;
