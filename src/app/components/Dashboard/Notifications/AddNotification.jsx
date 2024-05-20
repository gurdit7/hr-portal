"use client";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import { useState } from "react";
import sendEmail from "@/app/mailer/mailer";
import useAuth from "@/app/contexts/Auth/auth";
import Input from "../../Form/Input/Input";
import IconProfile from "../../Icons/IconProfile";
import IconNotes from "../../Icons/IconNotes";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import IconAttachment from "../../Icons/IconAttachment";

const AddNotification = () => {
  const [formData, setFromData] = useState({});
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');  
  const [attachment, setAttachment] = useState('Add Attachment');  
  const {userPermissions} = useAuth();
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
    console.log(e)
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
            console.log(reader)
        setAttachment(e.target.files[0].name)
  }
  const items = ["HI"];

  const submitForm = (e) => {
    setLoading(true);
    e.preventDefault();
    fetch("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then(function (res) {
        return res.json();
      })
      .then(async function (data) {
        if (data?.email) {
          await sendEmail(
            data?.email,
            "HR Portal - You are registerd.",
            `<h2 style='text-align:center;font-size: 200%;line-height: 1;margin: 0;'>Your are registered to the The fabcode's HR Portal.</h2>
            <p style="text-align:center;">Your Password is : <strong>fc@123456</strong>.</p>
            <p style="text-align:center;">To change you password please forgot password.</p>
            `
          ).then(function (data) {
            setAddNotification(true);
          });
          setSuccess({
            active: true,
            animation: true,
            message: "User added successfully!",
          });
        } else if (data?.status === 403) {
          setError({
            active: true,
            animation: true,
            message: "User Already Registerd.",
          });
        } else {
          setError({
            active: true,
            animation: true,
            message: "Something when wrong! Try again later.",
          });
        }
        setLoading(false);
        setFromData("");  
        setTimeout(() => {
          setError({
            active: false,
            animation: false,
            message: "",
          });
          setSuccess({
            active: false,
            animation: false,
            message: "",
          });
        }, 2000);
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
                  value={formData?.email || ""}
                  name="email"
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
                  required={true}
                  value={formData?.attachment || ""}
                  name="attachment"
                  multiple={false}
                  className="border-light-600 border"
                >
                  <IconAttachment size="24px" color="fill-light-400" />
                </Input>
            </form>
            </Wrapper>
            )}
</>
  );
};

export default AddNotification;
