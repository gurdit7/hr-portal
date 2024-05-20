'use client'

import useAuth from "@/app/contexts/Auth/auth";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import Text from "../../Ui/Text/Text";
import H3 from "../../Ui/H3/H3";

const ItemRecentNotifications = () => {
  const { userNotifications } = useAuth();
  return (
    <div className="flex flex-col gap-[15px]">            
      {userNotifications &&  userNotifications.map((item, index)=>{
        return(
          <Item item={item} key={index}  />
        )        
      })}
    </div>
  );
}

export default ItemRecentNotifications;


export const Item = ({item})=>{  
  return(
    <Wrapper className='border border-light-500'>
      <Wrapper className='p-[10px]'>
        <H3>{item?.subject}</H3>
        <Text className="mt-[5px]">{item?.description.substring(0, 169)}...</Text>
        <Wrapper>

        </Wrapper>
      </Wrapper>
    </Wrapper>
  )
}
