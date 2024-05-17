'use client';
import DropDown from "@/app/components/Form/DropDown/select";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconCategory from "@/app/components/Icons/IconCategory";
import IconDate from "@/app/components/Icons/IconDate";
import IconDesignation from "@/app/components/Icons/IconDesignation";
import IconGender from "@/app/components/Icons/IconGender";
import IconProfile from "@/app/components/Icons/IconProfile";
import IconUserType from "@/app/components/Icons/IconUserType";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import { designation, gender, userStatus, userType } from "@/app/data/default";
import { useState } from "react";
import Notification from "../../Ui/notification/success/Notification";
const EditEmployee = ({user,closePopup}) => {
    const [formData, setFromData] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const submitForm = (e) => {
        setLoading(true);
        e.preventDefault();
fetch('/api/dashboard/edit-employee',{
    method:"POST",
    body:JSON.stringify(
        {
            userType:formData?.userType || user?.userType,
            name:formData?.name || user?.name,
            joinDate:formData?.joinDate || user?.joinDate,
            designation:formData?.designation || user?.designation,
            role:formData?.role || user?.role,
            gender:formData?.gender || user?.gender,
            department:formData?.department || user?.department,
            DOB:formData?.DOB || user?.DOB,
            incrementDate:formData?.incrementDate || user?.incrementDate,
            userID:user?.userID,
            email:user?.email,
            status:formData?.status || user?.status || 'active'
        }
    )
}).then((res)=>{
    return res.json()
}).then((res)=>{
  setSuccess(true)
  setTimeout(() => {
    setLoading(false); 
    closePopup(false)   
  }, 2000);  
})
    };
    const addItemForm = (e) => {
        setFromData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
      const items = ["HI"];

  return (
    <>
    <form className="flex flex-col gap-[15px]" onSubmit={submitForm}>
   <Wrapper className="flex gap-[15px]">
      <DropDown
        items={userType}
        required={true}
        setData={addItemForm}
        value={formData?.userType || user?.userType}
        name="userType"
        placeholder={"User Type"}
      >
        <IconUserType size="24px" color="#BCBCBC" />
      </DropDown>
      <DropDown
        items={userStatus}
        required={true}
        setData={addItemForm}
        value={formData?.status || 'active'}
        name="status"
        placeholder={"User Status"}
      >
        <IconUserType size="24px" color="#BCBCBC" />
      </DropDown>
    </Wrapper>
    <Wrapper className="flex gap-[15px]">
      <Input
        label="Name"
        placeholder="Name"
        setData={addItemForm}
        type="text"
        required={true}
        value={formData?.name || user?.name}
        name="name"
        className="border-light-600 border"
      >
        <IconProfile size="24px" color="stroke-light-400" />
      </Input>            
      <Wrapper className="relative w-full flex-1">
        <Input
          label="Join Date"
          placeholder="Join Date"
          setData={addItemForm}
          type="date"
          required={true}
          value={formData?.joinDate || user?.joinDate}
          name="joinDate"
          className="border-light-600 border"
        >
          <IconDate size="24px" color="stroke-light-400" />
        </Input>
        <label className={`absolute left-[61px] top-[17px] pointer-events-none text-light-600 ${formData?.joinDate || user?.joinDate ? 'text-text-dark' : 'text-light-600'}`}>
          {formData?.joinDate || user?.joinDate || "Join Date"}
        </label>
      </Wrapper>
    </Wrapper>
    <Wrapper className="flex gap-[15px]">
    <DropDown
        items={designation}
        required={true}
        setData={addItemForm}
        value={formData?.designation || user?.designation}
        name="designation"
        placeholder={"Designation"}
        className='max-w-[247.5px]'
      >
                       <IconDesignation size="24px" color="stroke-light-400" />
      </DropDown>     
      <DropDown
        items={items}
        required={true}
        setData={addItemForm}
        value={formData?.role || user?.role}
        name="role"
        placeholder={"Role"}
      >
        <IconProfile size="24px" color="stroke-light-400" />
      </DropDown>
    </Wrapper>
    <Wrapper className="flex gap-[15px]">
      <DropDown
        items={items}
        required={true}
        setData={addItemForm}
        value={formData?.department ||  user?.department}
        name="department"
        placeholder={"Department"}
      >
        <IconCategory size="24px" color="stroke-light-400" />
      </DropDown>
      <DropDown
        items={gender}
        required={true}
        setData={addItemForm}
        value={formData?.gender ||  user?.gender}
        name="gender"
        placeholder={"Gender"}
      >
        <IconGender size="24px" color="stroke-light-400" />
      </DropDown>
    </Wrapper>
    <Wrapper className="flex gap-[15px]">
      <Wrapper className="relative w-full flex-1">
        <Input
          label="DOB"
          placeholder="DOB"
          setData={addItemForm}
          type="date"
          required={true}
          value={formData?.DOB || user?.DOB}
          name="DOB"
          className="border-light-600 border"
        >
          <IconDate size="24px" color="stroke-light-400" />
        </Input>
        <label className={`absolute left-[61px] top-[17px] pointer-events-none ${formData?.DOB || user?.DOB ? 'text-text-dark' : 'text-light-600'}`}>
          {formData?.DOB || user?.DOB || "DOB"}
        </label>
      </Wrapper>
      <Wrapper className="relative w-full flex-1">
        <Input
          label="Increment Date"
          placeholder="Increment Date"
          setData={addItemForm}
          type="date"
          required={true}
          value={formData?.incrementDate || user?.incrementDate}
          name="incrementDate"
          className="border-light-600 border"
        >
          <IconDate size="24px" color="stroke-light-400" />
        </Input>
        <label className={`absolute left-[61px] top-[17px] pointer-events-none text-light-600 ${formData?.incrementDate || user?.incrementDate ? 'text-text-dark' : 'text-light-600'}`}>
          {formData?.incrementDate || user?.incrementDate || "Increment Date"}
        </label>
      </Wrapper>
    </Wrapper>
 
    <FormButton
      type="submit"
      loadingText="Updating..."
      loading={loading}
      label="Update"
      btnType="solid"
    ></FormButton>
  </form>
  {success && (
        <Notification
          active={success}
          message='User successsfully updated.'
        ></Notification>
      )}
  </>
  );
}

export default EditEmployee;
