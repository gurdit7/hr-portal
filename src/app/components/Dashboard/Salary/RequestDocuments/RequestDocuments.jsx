"use client";

import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconDocument from "@/app/components/Icons/IconDocument";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import Notification from "@/app/components/Ui/notification/success/Notification";
import useAuth from "@/app/contexts/Auth/auth";
import { defaultTheme } from "@/app/data/default";
import sendEmail from "@/app/mailer/mailer";
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const RequestDocuments = () => {
  
  const RequestDocumentsList = [
    "Salary Slip - Last Three Months",
    "Experience Letter",
    "Other Documents",
  ];
  const {userData, getUserNotifications} = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [document, setDocument] = useState('Salary Slip - Last Three Months');
  const [description, setDescription] = useState('');  
  useEffect(()=>{
    setFormData({
      email:userData?.email,
      userID:userData?.userID,
      name:userData?.name
    })
  },[userData])
  const addDescription = (e)=>{
    setDescription(e);
    setFormData({
        ...formData,
        description: e,
      });
  }
  const addDocument = (e) => {
    setDocument(e.target.value);
    if (e.target.value === "Other Documents") {
      setFormData({
        ...formData,
        document: document
      });
    } else {
      setFormData({
        ...formData,
        document: e.target.value,
      });
    }
  };
  const submitForm = (e) => {
    e.preventDefault();
    setLoading(true);
    
    fetch("/api/dashboard/document", {
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
            "Document Requested - HR Portal",
            `<h2 style='text-align:center;font-size: 24px;line-height: 1;margin: 0;'>
            ${userData?.name} is requested <span style="color:#423E78;">${document}</span>.

           
            </h2>
            
            <p style="text-align:center;">
            Email : ${userData?.email}<br/>
            Please check on portal.</p>            
            `,      
          ).then(function (data) {
            setLoading(false);
            setSuccess(true);
            getUserNotifications();
            setDocument('Salary Slip - Last Three Months')
            setDescription('')
            setFormData({
              email:userData?.email,
              userID:userData?.userID,
              name:userData?.name
            })
            setTimeout(() => {
              setSuccess(false);
            }, 2500);
          });
        }
      });

  };
  const salarySlips = ()=>{    
  }
  return (
    <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col w-full">
      <H2>Request Documents</H2>
      <Wrapper className="mt-[15px]">
        <form onSubmit={submitForm}>
          <Wrapper className="flex gap-[10px] mb-[15px] justify-between">
          {RequestDocumentsList &&
                RequestDocumentsList.map((value, index) => (
            <Wrapper key={index} className="relative flex items-center gap-[5px]">
              <input
                type="radio"
                name="document"
                id={"document-radio" + index }
                value={value}
                className="w-5 h-5 min-w-5 min-h-5 appearance-none rounded-3xl border border-light-400 checked:border-8 checked:border-dark"
                onChange={addDocument}
              />
              <label
                htmlFor={"document-radio" + index }
                className="text-light-400 text-sm font-medium"
              >
                {value}
              </label>
            </Wrapper>))}
  
          </Wrapper>
          {document !== "Salary Slip - Last Three Months" &&
            document !== "Experience Letter" && (
              <Input
                type="text"
                required={true}
                name="document"
                value={document || ""}
                setData={addDocument}
                placeholder="Enter Document Name"
                className="border border-light-600"
              >
                <IconDocument size={24} color="fill-light-600" />
              </Input>
            )}
            <label  className="text-light-400 text-xs font-medium border-t border-light-400 w-full block mt-[15px] pt-[15px]">
            Message for Demanding Documents
            </label>
            <ReactQuill theme="snow" value={description} onChange={addDescription} className="mt-[5px] mb-[15px]" />
                  <FormButton
                  type="submit"
                  label="Request Document"                  
                  btnType="solid"
                  loading={loading}
                  loadingText="Requesting Document"                          
                >
                  
                </FormButton>
        </form>
        <FormButton
                  type="button"
                  label="Download Salary Slip"                  
                  btnType="solid"                        
                >
                  
                </FormButton>
      </Wrapper>
      {success && (
        <Notification
          active={success}
          message={defaultTheme?.requestDocumentsSuccess}
        ></Notification>
      )}
    </Wrapper>
  );
};

export default RequestDocuments;
