import { useRef } from "react";
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

const Item = ({ item, emailID, name }) => {
  const paraRef = useRef();

  return (
    <Wrapper className="border border-light-500 relative">
      <Wrapper className="p-[10px]">
        {item?.document && <Text className="!text-light-400">Document Requested</Text>}
        {item?.duration && <Text className="!text-light-400">Leave Requested</Text>}
        {item?.duration && ( <Link
        href={"/dashboard/leaves/" + item._id}
        className="opacity-0 absolute top-0 left-0 w-full h-full"
      >
        {" "} 
      </Link>
)}
        <H3>
          {item?.subject || item?.document} {item?.ExpectedSalary ? "Appraisal Request" : ""}
        </H3>
        {item?.description && (
          <div
            className="mt-[5px] text-sm font-medium font-poppins text-text-dark"
            ref={paraRef}
          >
            {toHTML(paraRef, item?.description, 350)}
          </div>
        )}
        <Wrapper className="flex justify-between items-center border-t border-light-500 pt-[5px] mt-[5px]">
          <Text>{item?.name && "Applied By: " + item?.name}</Text>
          <Text>{formatDate(item?.updatedAt)}</Text>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default Item;
