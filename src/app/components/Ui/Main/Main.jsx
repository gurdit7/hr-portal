'use client'
import { useThemeConfig } from '@/app/contexts/theme/ThemeConfigure';
import Wrapper from '../Wrapper/Wrapper';

const Main = ({children}) => {
    const {themeMode} = useThemeConfig();
  return (
    <Wrapper className={ "dark:bg-gray-800 min-h-screen " + themeMode }> {children}</Wrapper>
  );
}

export default Main;
