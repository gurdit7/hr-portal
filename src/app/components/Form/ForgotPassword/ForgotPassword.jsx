'use client'
import { useState } from "react";
import Input from "../Input/Input";
import IconMail from "../../Icons/Mail/IconMail";
import FormButton from "../FormButton/FormButton";
import Text from "../../Ui/Text/Text";
import { useRouter } from "next/navigation";
const ForgotPassword = () => {
    const route = useRouter();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const setFormValues = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
    })
    }
    const submitForm = ()=>{

    }
    const forgotPassword = ()=>{      
      route.push('/account/login')
    }
  return (
    <form className='max-w-[500px] w-full flex flex-col gap-[15px]' onSubmit={submitForm}>
        <Input name='email' value={formData?.email} type="email" setData={setFormValues} required  placeholder="Email Address">
                <IconMail size='24px' color='fill-[#C2C3CB]' />
            </Input> 
            <FormButton loading={loading} loadingText="Signing..." type="submit" label="Sign In" btnType="solid"/>
            <Text className="text-center font-poppins text-sm font-medium text-white flex flex-col gap-4">
           or <FormButton event={forgotPassword} label="Sign In" type="button" btnType="link"/>
            </Text>
             
    </form>
  );
}

export default ForgotPassword;
