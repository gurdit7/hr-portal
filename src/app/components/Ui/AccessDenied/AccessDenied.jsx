'use client';
import Wrapper from '../Wrapper/Wrapper';
import H1 from '../H1/H1';
import useAuth from '@/app/contexts/Auth/auth';
import FormButton from '../../Form/FormButton/FormButton';
import { useState } from 'react';
import sendEmail from '@/app/mailer/mailer';
import { useDashboard } from '@/app/contexts/Dashboard/dashboard';

const AccessDenied = ({permission, message}) => {
    const {userData} = useAuth();
    const { userPermissions } = useDashboard();
    const [loading,setLoading] = useState(false);
    const [heading,setHeading] = useState("You don't have access to this page.");
    const [hide,setHide] = useState(true);
    const requestAccess = async ()=> {
        setLoading(true)
        await sendEmail(
            'thefabcodeuser9@gmail.com',
            `${userData?.email} is requesting for access.`,
            `<h2 style='text-align:center;font-size: 150%;line-height: 1;margin: 0;'>
            User ${userData?.email} is requesting for access to ${message}.
            </h2>
            `
          ).then(function (data) {
            setHide(false)
            setLoading(false)
            setHeading('Your request is sent. We will contact you.')
          });
    }
  return (
    <>
    {userPermissions && !userPermissions?.includes(permission) && (
<Wrapper className='w-full  items-center justify-center flex'>
<Wrapper className='w-full bg-white dark:bg-gray-700 dark:border-gray-600 rounded-xl py-4 px-7'>
<H1 className='text-xl text-center leading-normal'>
   {heading}
</H1>
{hide && (
<Wrapper className='max-w-60 m-auto mt-4'>
<FormButton label='Request Access' type='button' btnType='solid' event={requestAccess} loading={loading} loadingText='Sending...' />
</Wrapper>
)}
</Wrapper>
</Wrapper>
)}
</>
  );
}

export default AccessDenied;
