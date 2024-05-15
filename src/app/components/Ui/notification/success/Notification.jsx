"use client";
import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import Text from '../../Text/Text';
import Wrapper from '../../Wrapper/Wrapper';
const  Notification = ({children,message, className, active})=> {
    className = className || '';
    const [activeNoti,setActiveNoti] = useState(false);
    useEffect(()=>{
        setTimeout(()=>{
        setActiveNoti(active);
    },500)
    },[active])
  return (
   <Wrapper className={className + ' fixed top-20 right-4 max-w-96 w-full sm:p-3 flex items-center justify-between duration-500 bg-green-500 rounded-lg  md:mt-0 l:p-0   transition-all ' + `${activeNoti === true ? ' opacity-1 translate-y-0' : ' cursor-not-allowed pointer-events-none opacity-0 translate-y-7'}`}>
    <Text className="flex-1 text-white">
        {children}
        {message}
    </Text>
   </Wrapper>
  );
}
Notification.propTypes = {
    children: PropTypes.string,
    message: PropTypes.string,
    className: PropTypes.string
};

export default Notification;
