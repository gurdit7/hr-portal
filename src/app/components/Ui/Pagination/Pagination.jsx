'use client'
import { useEffect, useState } from "react";
import IconArrowBackword from "../../Icons/IconArrowBackword";
import IconArrowForward from "../../Icons/IconArrowForward";
import Wrapper from "../Wrapper/Wrapper";

const Pagination = ({ count, index, getIndex }) => {
    const [_index, setIndex] = useState(index);
    const [arrowBackword, setArrowBackword] = useState(false);
    const [arrowForward, setArrowForward] = useState(false);
    const backword = (e)=> {
        const number = e-1;
        if(number > 0){
        setIndex(number)
        setArrowForward(false);
        getIndex(e)
        }
        if(number === 0){
            setIndex(0)
            getIndex(0)
            setArrowBackword(true)
        }
    }
    const forword = (e)=> {
        const number = e+1;
     const num = e + 2;
        if(num < count){
        setIndex(number)
        setArrowBackword(false);
        getIndex(number);
        }
        if(num === count){
            setIndex(count - 1)
            getIndex(count);
            setArrowForward(true)
        }        
    }
    const setCount = (i)=>{
        getIndex(i);
        setIndex(i)
    }
  return <Wrapper className='flex gap-[10px] justify-center mt-[15px]'>
 <div  onClick={()=>backword(_index)} className={ `w-8 text-base text-text-dark font-medium h-8 border flex items-center justify-center  border-light-500 ${arrowBackword ? 'opacity-30 cursor-not-allowed' : ' cursor-pointer'} ${_index === 0 ? 'opacity-30 cursor-not-allowed' : ' cursor-pointer'} `}>
      <IconArrowBackword size='12px' color='fill-black' />
</div>
{Array.from(Array(count), (e, i) => {    
    return <div key={i} onClick={()=> setCount(i)} className={ `w-8 text-base text-text-dark font-medium h-8 border flex items-center justify-center  border-light-500 ${_index === i ? 'bg-light-500 cursor-not-allowed' : 'cursor-pointer'}`}>
    {i + 1}
  </div>
  })}

<div  onClick={()=>forword(_index)} className={ `${arrowForward ? 'opacity-30 cursor-not-allowed ' : 'cursor-pointer'} w-8 text-base text-text-dark font-medium h-8 border flex items-center justify-center  border-light-500`}>
      <IconArrowForward size='12px' color='fill-black' />
</div>
  </Wrapper>;
};

export default Pagination;
