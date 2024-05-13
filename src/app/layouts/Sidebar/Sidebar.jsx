'use client';
import ProfileImage from '@/app/components/Dashboard/Profile/Image/ProfileImage';
import Text from '@/app/components/Ui/Text/Text';
import Wrapper from '@/app/components/Ui/Wrapper/Wrapper';
import React from 'react';
import Link from 'next/link'
import IconDashboard from '@/app/components/Icons/Dashboard/IconDashboard';
import { usePathname } from 'next/navigation';
const Sidebar = () => {
  const path = usePathname();
  return (
  <aside className='fixed h-[100vh] max-w-[300px] w-full left-0 top-0 bg-dark-blue py-5'>
    <Wrapper>
        <Text className='text-center text-2xl font-poppins text-white font-bold mb-4'>
        HR PORTAL
        </Text>
        <ProfileImage size="134px"/>
        <Text className='text-lg font-poppins font-semibold text-center text-white mt-[10px]'>
          User Name Here
        </Text>
        <Wrapper classname='mt-[35px] pl-12'>
          <ul className='list-none p-0 mt-0'>
            <DashboardLink href={'/dashboard'} label='Dashboard' active={path === '/dashboard'}>
                <IconDashboard size={'24px'} color={path === '/dashboard' ? 'fill-dark-blue' : 'fill-white'}/>
            </DashboardLink>
          </ul>
        </Wrapper>
    </Wrapper>
  </aside>
  );
}

export default Sidebar;

const DashboardLink = ({href,label,children,active})=>{
  return(
<>
<li>
<Link href={href} className={ `${active ? ' text-dark-blue bg-bg rounded-l-[60px]' : 'text-white' } flex items-center text-sm font-semibold uppercase gap-[5px] px-[25px] py-[12px]` }>
{children} {label}
</Link>
</li>
</>
  )
}
