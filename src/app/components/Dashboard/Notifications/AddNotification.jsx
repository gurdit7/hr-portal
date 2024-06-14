"use client";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import { useState } from "react";
import sendEmail from "@/app/mailer/mailer";
import Input from "../../Form/Input/Input";
import IconProfile from "../../Icons/IconProfile";
import IconNotes from "../../Icons/IconNotes";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import IconAttachment from "../../Icons/IconAttachment";
import FormButton from "../../Form/FormButton/FormButton";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";

const AddNotification = () => {
  const [formData, setFromData] = useState({});
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');  
  const [attachment, setAttachment] = useState('Add Attachment');  
  const {userPermissions} = useDashboard();
  const [success, setSuccess] = useState({
    active: false,
    animation: false,
    message: "",
  });
  const [error, setError] = useState({
    active: false,
    animation: false,
    message: "",
  });
  const addItemForm = (e) => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const addDescription = (e) => {
    setDescription(e);
    setFromData({
        ...formData,
        description: e,
      });
  };
  const addAttachment = (e)=>{
        
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            
            });
            reader.readAsDataURL(e.target.files[0]);
            
        setAttachment(e.target.files[0].name)
  }
  const items = ["HI"];

  const submitForm = (e) => {
    setLoading(true);
    e.preventDefault();
    fetch("/api/dashboard/notifications", {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {
        await sendEmail(
          formData?.emails,
          "HR Portal - You are registerd.",
          `<h2 style='text-align:center;font-size: 200%;line-height: 1;margin: 0;'>Your are registered to the The fabcode's HR Portal.</h2>
          <p style="text-align:center;">Your Password is : <strong>fc@123456</strong>.</p>
          <p style="text-align:center;">To change you password please forgot password.</p>
          `
        ).then(function (data) {    
          setLoading(false)
        });
      });
  };
  return (
<>
{userPermissions && userPermissions.includes('add-notifications') && (
          <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full max-w-[550px]">
            <H2>Add Notification</H2>
            <form className="flex flex-col gap-[15px]" onSubmit={submitForm}>
            <Input
                  label="To"
                  placeholder="To"
                  setData={addItemForm}
                  type="email"
                  required={true}
                  value={formData?.emails || ""}
                  name="emails"
                  multiple={true}
                  className="border-light-600 border"
                >
                  <IconProfile size="24px" color="stroke-light-400" />
                </Input>
                <Input
                  label="Subject"
                  placeholder="Subject"
                  setData={addItemForm}
                  type="text"
                  required={true}
                  value={formData?.subject || ""}
                  name="subject"
                  multiple={true}
                  className="border-light-600 border"
                >
                  <IconNotes size="24px" color="stroke-light-400" />
                </Input>
                <ReactQuill theme="snow" value={description} onChange={addDescription} />
                <Input
                  label="Add Attachment"
                  placeholder={attachment}
                  setData={addAttachment}
                  type="file"
                  required={false}
                  value={formData?.attachment || ""}
                  name="attachment"
                  multiple={false}
                  className="border-light-600 border"
                >
                  <IconAttachment size="24px" color="fill-light-400" />
                </Input>
                <FormButton
                type="submit"
                loadingText="Adding..."
                loading={loading}
                label="Add"
                btnType="solid"
              ></FormButton>
            </form>
            </Wrapper>
            )}
</>
  );
};

export default AddNotification;
