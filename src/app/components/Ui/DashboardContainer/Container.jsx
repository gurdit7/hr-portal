'use client';
import { useThemeConfig } from '@/app/contexts/theme/ThemeConfigure';
import Wrapper from '../Wrapper/Wrapper';
import H1 from '../H1/H1';
import SkeletonLoader from '../skeletonLoader/skeletonLoader';

const Container = ({heading, children}) => {
const { sidebarCollapse } = useThemeConfig();

  return (
    <Wrapper
    className={`py-[10px] px-[25px] ${
      sidebarCollapse ? "ml-[100px]" : "ml-[300px]"
    }`}
  >
    <H1>{heading}</H1>
   {!heading && <SkeletonLoader className={'!h-[72px] max-w-[40%] rounded-lg '} />   } 
    <Wrapper className="mt-[15px]">

{children}

    </Wrapper>
  </Wrapper>
  );
}

export default Container;
