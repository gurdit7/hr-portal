'use client';
import { useThemeConfig } from '@/app/contexts/theme/ThemeConfigure';
import Wrapper from '../Wrapper/Wrapper';
import H1 from '../H1/H1';
import SkeletonLoader from '../skeletonLoader/skeletonLoader';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const Container = ({heading, children, className}) => {
const { sidebarCollapse, breadcrumbs } = useThemeConfig();

  return (
    <Wrapper
    className={`pb-8 ${className || ''} py-[10px] px-[25px] max-xl:px-4 max-xl:py-6 dark:bg-gray-800 dark:border-gray-700 max-tab:m-0 ${
      sidebarCollapse ? "ml-[100px]" : "ml-[300px] max-4xl:ml-[200px]"
    }`}
  >
   {heading && <Breadcrumbs items={breadcrumbs} /> }
    {!heading && <SkeletonLoader className={'!h-[12px] max-w-[40%] rounded-lg mb-1 '} />   } 
    <H1 className='max-tab:text-4xl'>{heading}</H1>
   {!heading && <SkeletonLoader className={'!h-[72px] max-w-[40%] rounded-lg '} />   } 
    <Wrapper className="mt-[15px]">

{children}

    </Wrapper>
  </Wrapper>
  );
}

export default Container;
