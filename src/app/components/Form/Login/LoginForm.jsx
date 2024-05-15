'use client'
import { useEffect, useState } from "react";
import Input from "../Input/Input";
import "./style.css";
import IconMail from "../../Icons/IconMail";
import Password from "../Password/Password";
import IconLock from "../../Icons/IconLock";
import FormButton from "../FormButton/FormButton";
import Text from "../../Ui/Text/Text";
import { useRouter } from "next/navigation";
import useAuth from "@/app/contexts/Auth/auth";
const LoginForm = () => {
    const route = useRouter();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const {setUserData,setUserLoggedIn} = useAuth();
    const setFormValues = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
    })
    }
    const submitForm = (e)=>{
      e.preventDefault();
      fetch("/api/auth/sign-in", {
        method: "POST",
        body: JSON.stringify(formData),
     })
        .then(function (res) {
           return res.json();
        })
        .then(function (data) {
          setUserLoggedIn(data)
          setUserData(data)
            console.log(data)
        });
    }
    const forgotPassword = ()=>{      
      route.push('/account/forgot-password')
    }
   return (
    <form className='max-w-[500px] w-full flex flex-col gap-[15px]' onSubmit={submitForm}>
        <Input name='email' value={formData?.email || ''} type="email" setData={setFormValues} required  placeholder="Email Address">
                <IconMail size='24px' color='fill-[#C2C3CB]' />
            </Input> 
            <Password
            name='password'            
            required
            setData={setFormValues}
            value={formData?.password || ''}
            >
              <IconLock size='24px' color='fill-[#C2C3CB]'  />
            </Password>
            <FormButton loading={loading} loadingText="Signing..." type="submit" label="Sign In" btnType="solid"/>
            <Text className="text-center font-poppins text-sm font-medium text-white">
            Can't remember password? <FormButton event={forgotPassword} label="Forgot Password" type="button" btnType="link"/>
            </Text>
             
    </form>
  );
}

export default LoginForm;
