"use client";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconSalary from "@/app/components/Icons/IconSalary";
import H2 from "@/app/components/Ui/H2/H2";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import Notification from "@/app/components/Ui/notification/success/Notification";
import useAuth from "@/app/contexts/Auth/auth";
import { defaultTheme } from "@/app/data/default";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const AppraisalForm = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [description, setDescription] = useState("");
  useEffect(() => {
    setFormData({
      email: userData?.email,
      name: userData?.name,
      userID: userData?.userID,
    });
  }, [userData]);
  const addDescription = (e) => {
    setDescription(e);
    setFormData({
      ...formData,
      description: e,
    });
  };
  const addFormValues = (e) => {
    setFormData({
      ...formData,
      key: userData?._id,
      currentSalary: userData?.currentSalary,
      [e.target.name]: e.target.value,
    });
  };
  const submitForm = (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData?.description.length > 250) {
      fetch("/api/dashboard/appraisal", {
        method: "POST",
        body: JSON.stringify(formData),
      })
        .then(function (res) {
          return res.json();
        })
        .then(async function (data) {
          if (data?.user) {
            setLoading(false);
            setFormData(" ");
            setDescription(" ");
            setSuccess(true);
          }
        }).catch(error=>{
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError(true);
    }
  };
  return (
    <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col w-full">
      <H2>Appraisal Form</H2>
      <Wrapper className="mt-[15px]">
        <form onSubmit={submitForm}>
          <Input
            type="number"
            required={true}
            name="ExpectedSalary"
            value={formData?.ExpectedSalary || ""}
            setData={addFormValues}
            placeholder="Expected Salary"
            className="border border-light-600"
          >
            <IconSalary size={24} color="fill-light-600" />
          </Input>
          <label className="text-light-400 text-xs font-medium  w-full block mt-[15px]">
            Reason for Appraisal
          </label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={addDescription}
            className="mt-[5px] mb-[15px]"
          />
          {error && (
            <span className="block text-xs mb-2 text-red-500">
              Please add a brief description. Please add atleast 250 character.
            </span>
          )}
          <FormButton
            type="submit"
            label="Submit"
            btnType="solid"
            loading={loading}
            loadingText="Submiting"
          ></FormButton>
        </form>
      </Wrapper>
      {success && (
        <Notification
          active={success}
          message={defaultTheme?.requestAppraisalSuccess}
        ></Notification>
      )}
    </Wrapper>
  );
};

export default AppraisalForm;
