'use client'
import { useState } from "react";
import Input from "../Input/Input";
import "./style.css";
import IconMail from "../../Icons/Mail/IconMail";
const LoginForm = () => {
    const [formData, setFormData] = useState({});
    const setFormValues = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
    })
    }
  return (
    <form className='max-w-[500px] w-full'>
        <Input name='email' value={formData.email} type="email" setData={setFormValues} required  placeholder="Email Address">
                <IconMail size='24px' color='fill-[#C2C3CB]' />
            </Input> 
    </form>
  );
}

export default LoginForm;
