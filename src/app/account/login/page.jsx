import Wrapper from '@/app/components/Ui/Wrapper/Wrapper';
import './style.css';
import Heading1 from '@/app/components/Ui/Heading 1/Heading 1';
import Image from 'next/image';
import Logo from '../../assets/images/logo/logo.png'
import H1 from '@/app/components/Ui/H1/H1';
import LoginForm from '@/app/components/Form/Login/LoginForm';
const page = () => {
  return (
<Wrapper classname='bg-bg '>
<Wrapper classname='flex justify-between '>
<Wrapper classname='flex-1 flex flex-col items-center justify-center'>
<svg width="132" height="99" viewBox="0 0 132 99" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M101.199 0.667725C118.21 0.667725 132 14.4617 132 31.4789C132 48.4901 118.21 62.2841 101.199 62.2841C101.199 62.2841 101.348 73.729 110.645 90.2011C111.678 93.5016 109.837 97.0164 106.535 98.0433C104.191 98.7803 101.726 98.0639 100.133 96.3961C78.7542 73.0125 70.3857 45.4915 70.3857 31.4789C70.3857 14.4617 84.1755 0.667725 101.199 0.667725Z" fill="#B2A6FF"/>
<path d="M30.8131 0.667725C47.8244 0.667725 61.6145 14.462 61.6145 31.4789C61.6145 48.4901 47.8244 62.2841 30.8131 62.2841C30.8131 62.2841 30.9621 73.729 40.2599 90.2011C41.2927 93.5016 39.4514 97.0164 36.1491 98.0433C33.8058 98.7803 31.3401 98.0639 29.7481 96.3961C8.36874 73.0125 -0.000106812 45.4915 -0.000106812 31.4789C-0.000106812 14.4617 13.79 0.667725 30.8131 0.667725Z" fill="#B2A6FF"/>
</svg>
<Heading1 classname='text-center px-[93px]'>
The way to get started is to quit talking and begin doing.
</Heading1>
  </Wrapper>
  <Wrapper classname='flex-1 login-bg relative min-h-[100vh]'>
    <Wrapper classname='relative z-[1] flex flex-col items-center p-[60px]'>
    <Image src={Logo.src} alt={Logo.alt} width={Logo.width} height={Logo.height}/>
      <H1 tag={true} classname='text-white max-w-[450px] text-center'>
      Welcome to Fabcode’s HR Hub
      </H1>
      <LoginForm/>
    </Wrapper>
    <Wrapper classname='absolute top-0 left-0 w-full h-full bg-dark-blue opacity-80'>

    </Wrapper>
  </Wrapper>
</Wrapper>
<Wrapper>
  
</Wrapper>  
</Wrapper>
  );
}

export default page;
