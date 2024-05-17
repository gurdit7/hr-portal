'use client';
import ProfileImage from '@/app/components/Dashboard/Profile/Image/ProfileImage';
import Text from '@/app/components/Ui/Text/Text';
import Wrapper from '@/app/components/Ui/Wrapper/Wrapper';
import React from 'react';
import Link from 'next/link'
import IconDashboard from '@/app/components/Icons/IconDashboard';
import { usePathname } from 'next/navigation';
import IconProfile from '@/app/components/Icons/IconProfile';
import useAuth from '@/app/contexts/Auth/auth';
import { useThemeConfig } from '@/app/contexts/theme/ThemeConfigure';
const Sidebar = () => {
  const {sidebarCollapse} = useThemeConfig();
  const {userLoggedIn, userPermissions, userData} = useAuth();
  const path = usePathname();  
  return (
    <>
    {userLoggedIn && (
  <aside className={`fixed h-[100vh]  w-full left-0 top-0 transition-all duration-200 bg-dark-blue py-5 ${sidebarCollapse ? 'max-w-[100px]' : 'max-w-[300px]'}`}>
    <Wrapper>
        <Text className={`text-center  font-poppins text-white  mb-4 transition-all duration-200 ${sidebarCollapse ? 'text-sm font-normal' : '!text-2xl !font-bold'}` }>
        HR PORTAL
        </Text>
        <ProfileImage size={sidebarCollapse ? '46px' : '134px'}/>
        <Text className={` font-poppins font-semibold text-center text-white mt-[10px] ${sidebarCollapse ? 'text-sm font-normal' : '!text-lg'}`}>
          {userData?.name}
        </Text>
        <Wrapper className={`mt-[35px]  ${sidebarCollapse ? 'pl-[10px]' : 'pl-12'}`}>
          <ul className='list-none p-0 mt-0'>
            <DashboardLink sidebarCollapse={sidebarCollapse} href={'/'} label='Dashboard' active={path === '/'}>
                <IconDashboard size={'24px'} color={path === '/' ? 'fill-dark-blue' : 'fill-white'}/>
            </DashboardLink>
            <DashboardLink sidebarCollapse={sidebarCollapse} href={'/dashboard/profile'} label='Profile' active={path === '/dashboard/profile'}>
                <IconProfile size={'24px'} color={path === '/dashboard/profile' ? 'stroke-dark-blue' : 'stroke-white'}/>
            </DashboardLink>
            {userPermissions && (
            userPermissions?.includes('view-employee') && (<DashboardLink sidebarCollapse={sidebarCollapse} href={'/dashboard/employees'} label='Employees' active={path === '/dashboard/employees'}>
                <IconProfile size={'24px'} color={path === '/dashboard/employees' ? 'stroke-dark-blue' : 'stroke-white'}/>
            </DashboardLink>) 
            )}
            
          </ul>
        </Wrapper>
    </Wrapper>
  </aside>
    )}
    </>
  );
}

export default Sidebar;

const DashboardLink = ({href,label,children,active,sidebarCollapse})=>{
  return(
<>
<li>
<Link href={href} className={ `${active ? ' text-dark-blue bg-bg rounded-l-[60px]' : 'text-white' } flex items-center text-sm font-semibold uppercase gap-[5px] px-[25px] py-[12px]` }>
{children}
 {sidebarCollapse ? '' : label}
</Link>
</li>
</>
  )
}
