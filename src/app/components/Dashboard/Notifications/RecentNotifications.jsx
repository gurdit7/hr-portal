"use client";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import ItemRecentNotifications from "./ItemRecentNotifications";
const RecentNotifications = () => {

  return (
    <>
    <Wrapper className='p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full'>
      <ItemRecentNotifications />
      </Wrapper>
    </>
  );
};

export default RecentNotifications;
