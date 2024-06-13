"use client";
import React, { useEffect, useState } from "react";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import IconDelete from "../../Icons/IconDelete";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import useAuth from "@/app/contexts/Auth/auth";
import Modal from "../../Ui/Modal/Modal";
import FormButton from "../../Form/FormButton/FormButton";
import Notification from "../../Ui/notification/success/Notification";
import ErrorNotification from "../../Ui/notification/loader/LoaderNotification";

const AllHolidays = () => {

  const { userPermissions, holidays, getHolidays } = useDashboard();
  const { userData } = useAuth();
  const [btnLoader, setBtnLoader] = useState(false);
  const [formDataDelete, setFormDataDelete] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [success, setSuccess] = useState({
    active: false,
    message: "",
  });
  const [error, setError] = useState({
    active: false,
    message: "",
  });
  const closeModal = (e) => {
    setShowDeleteModal(e);
  };
  useEffect(() => {
  
  }, []);
  const showModalDelete = (name) => {
    setShowDeleteModal(true);
    setFormDataDelete({
      ...formDataDelete,
      key: `f6bb694916a535eecf64c585d4d879ad_${userData?._id}`,
      name: name,
    });
  };
  const deleteHolidays = (e) => {
    e.preventDefault();
    setBtnLoader(true);
    fetch("/api/dashboard/holidays", {
      method: "DELETE",
      body: JSON.stringify(formDataDelete),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setSuccess({
          active: true,
          message: "Holiday is deleted successfully.",
        });
        setTimeout(() => {
          getHolidays(userData?._id);
          setBtnLoader(false);
          setShowDeleteModal(false);
          setSuccess({
            active: false,
            message: "",
          });
        }, 2000);
      })
      .catch((error) => {
        setError({
          active: true,
          message: "Something went wrong! try again later.",
        });

        setTimeout(() => {
          setBtnLoader(false);
          setError({
            active: false,
            message: "",
          });
        }, 2000);
      });
  };
  return (
    <div>
      {holidays && (
        <Wrapper>
          <Wrapper className="flex bg-dark-blue">
            <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white max-w-20">
              S.no
            </Wrapper>
            <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
              Date
            </Wrapper>
            <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
              Festival
            </Wrapper>
            <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
              Day
            </Wrapper>
            {userPermissions && userPermissions?.includes("write-holidays") && (
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
                Action
              </Wrapper>
            )}
          </Wrapper>
          <Wrapper className="border border-light-500 border-t-0">
            {holidays &&
              holidays.map((item, i) => (
                <Wrapper
                  key={i}
                  className={` flex items-center ${i} ${
                    i > 0 ? "border-t border-light-500" : ""
                  }`}
                >
                  <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize max-w-20">
                    {i + 1}
                  </Wrapper>
                  <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize">
                    {item.date}
                  </Wrapper>
                  <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize">
                    {item.festival}
                  </Wrapper>
                  <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize">
                    {item.day}
                  </Wrapper>
                  {userPermissions &&
                    userPermissions?.includes("write-holidays") && (
                      <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark flex gap-[2px]">
                        <span
                          onClick={() => showModalDelete(item?._id)}
                          className="rounded-full w-[30px] h-[30px] bg-red-600 flex justify-center items-center cursor-pointer hover:scale-110"
                        >
                          <IconDelete size="16px" color="fill-white" />
                        </span>
                      </Wrapper>
                    )}
                </Wrapper>
              ))}
          </Wrapper>
        </Wrapper>
      )}
      {showDeleteModal && (
        <Modal
          opened={showDeleteModal}
          hideModal={closeModal}
          heading="Are you sure you want to remove holiday?"
        >
          <Wrapper className="max-w-[510px] m-auto">
            <form className=" flex gap-4" onSubmit={deleteHolidays}>
              <Wrapper className="flex-1">
                <FormButton
                  type="button"
                  label="No"
                  loading={btnLoader}
                  loadingText="No"
                  btnType="outlined"
                  additionalCss='min-h-[54px]'
                ></FormButton>
              </Wrapper>{" "}
              <Wrapper className="flex-1">
                <FormButton
                  type="submit"
                  label="Yes"
                  loading={btnLoader}
                  loadingText="Yes"
                  btnType="solid"
                ></FormButton>
              </Wrapper>
            </form>
          </Wrapper>
        </Modal>
      )}
           {success.active && (
        <Notification active={success.active} message={success.message} />
      )}
      {error.active && (
        <ErrorNotification active={error.active} message={error.message} />
      )}
    </div>
  );
};

export default AllHolidays;
