'use client';
import { useEffect, useState } from 'react';
import FormButton from '../../Form/FormButton/FormButton';
import IconCloseModal from '../../Icons/IconCloseModal';
import Wrapper from '../Wrapper/Wrapper';
import H1 from '../H1/H1';
import Heading1 from '../Heading 1/Heading 1';

const Modal = ({children, opened, hideModal, heading}) => {    
    const [open,setOpen] = useState(opened);
    const [openFinal,setOpenFinal] = useState(false);
    const closeModal = ()=>{
        setOpenFinal(false)
        setTimeout(() => {
            hideModal(false)    
        }, 500);        
    }
    useEffect(()=>{
        setTimeout(() => {
            setOpenFinal(open)    
        }, 100);     
    },[open])

  return (
<Wrapper className={`fixed top-0 z-[999]  left-0 w-full  h-full flex justify-center items-center  duration-500 ${openFinal ? 'opacity-1 scale-100' : 'opacity-0 scale-90'}`}>
    <FormButton additionalCss='absolute top-3 right-3 z-30' event={closeModal}>
        <IconCloseModal size="56px" color="fill-white"/> 
        </FormButton>
        <Wrapper className='relative z-20 py-6 w-full overflow-auto max-h-[100vh]'>
{heading && (<H1 className='text-3xl text-white text-center mb-[14px] leading-normal'>{heading}</H1>) }
{children}
</Wrapper>
<Wrapper className='bg-dark-blue bg-opacity-90 backdrop-blur-xl w-full h-full absolute'/>
</Wrapper>
  );
}

export default Modal;
