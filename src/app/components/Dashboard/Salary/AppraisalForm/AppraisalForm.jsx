'use client'

import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconSalary from "@/app/components/Icons/IconSalary";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import Notification from "@/app/components/Ui/notification/success/Notification";
import useAuth from "@/app/contexts/Auth/auth";
import sendEmail from "@/app/mailer/mailer";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
const AppraisalForm = () => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const {userData} = useAuth();
    const [success, setSuccess] = useState(false);
    const [description, setDescription] = useState('');  
    useEffect(()=>{
      setFormData({
        email:userData?.email,
        name:userData?.name,
        userID:userData?.userID
      })
    },[userData])
    const addDescription = (e)=>{
      setDescription(e);
      setFormData({
          ...formData,
          description: e,
        });
    }
    const addFormValues = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
          });
      };
    const submitForm = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch("/api/dashboard/appraisal", {
          method: "POST",
          body: JSON.stringify(formData),
        })
          .then(function (res) {
            return res.json();
          })
          .then(async function (data) {
            if (data?.email) {
              await sendEmail(
                'gurditthefabcode@gmail.com',
                "Appraisal Request - HR Portal",
                `<h2 style='text-align:center;font-size: 24px;line-height: 1;margin: 0;'>
                ${userData?.name} is requested for Appraisal.
                </h2>                
                <p style="text-align:center;">
                Email : ${userData?.email}<br/>
                Expected Salary : ${formData?.ExpectedSalary}<br/>
                Please check on portal.</p>            
                `,      
              ).then(function (data) {
                setLoading(false); 
                setFormData('');
                setDescription('')
              });
          
            } 
           
          });
    }
  return (
    <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col w-full">
    <H2>Appraisal Form</H2>
    <Wrapper className="mt-[15px]">
      <form onSubmit={submitForm}>
        <Input
              type="text"
              required={true}
              name="ExpectedSalary"
              value={formData?.ExpectedSalary || ""}
              setData={addFormValues}
              placeholder="Expected Salary"
              className="border border-light-600"
            >
              <IconSalary size={24} color="fill-light-600" />
            </Input>
          <label  className="text-light-400 text-xs font-medium  w-full block mt-[15px]">
          Reason for Appraisal

          </label>
          <ReactQuill theme="snow" value={description} onChange={addDescription} className="mt-[5px] mb-[15px]" />
                <FormButton
                type="submit"
                label="Submit"                  
                btnType="solid"
                loading={loading}
                loadingText="Submiting"                          
              >
                
              </FormButton>
      </form>
    </Wrapper>
    {success && (
      <Notification
        active={success}
        message={defaultTheme?.requestDocumentsSuccess}
      ></Notification>
    )}
  </Wrapper>
  );
}

export default AppraisalForm;
