'use cleint';
import './style.css'
import { useEffect, useState } from "react";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import Input from "../Input/Input";

const Date = ({
    label,
    updateValue,
    placeholder,    
    children,
    getDate,
    name
}) => {
    const setDateValue = (e)=>{
        getDate(e.target.value)
        setDate(e.target.value)
    }
    const [date, setDate] = useState(updateValue);    
  return (
<Wrapper className='relative w-full flex-1'>
<Input
                  label={label}
                  placeholder={placeholder}
                  setData={setDateValue}
                  type='date'
                  required={true}
                  value={date}
                  name={name}
                  className="border-light-600 dark:border-gray-600 border"
                >
                 {children} 
                </Input>     
                <label className='absolute left-[48px] top-[34px] pointer-events-none text-light-600'>{date || placeholder}</label>          
</Wrapper>
  );
}

export default Date;
