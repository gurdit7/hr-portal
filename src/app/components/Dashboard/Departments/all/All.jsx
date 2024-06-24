"use client";

import DropDown from "@/app/components/Form/DropDown/select";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconCategory from "@/app/components/Icons/IconCategory";
import IconDelete from "@/app/components/Icons/IconDelete";
import IconEdit from "@/app/components/Icons/IconEdit";
import H2 from "@/app/components/Ui/H2/H2";
import Modal from "@/app/components/Ui/Modal/Modal";
import Pagination from "@/app/components/Ui/Pagination/Pagination";
import Text from "@/app/components/Ui/Text/Text";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import ErrorNotification from "@/app/components/Ui/notification/loader/LoaderNotification";
import Notification from "@/app/components/Ui/notification/success/Notification";
import useAuth from "@/app/contexts/Auth/auth";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import { department } from "@/app/data/default";
import { useEffect, useState } from "react";

const All = () => {
  const { userData } = useAuth();
  const { departments, getDepartments } = useDashboard();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState("");
  const [formDataDelete, setFormDataDelete] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const limit = 10;
  const [allDepartments, setDepartments] = useState([]);
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(0);
  const handlePageChange = (e) => {
    setStart(e);
  };
  useEffect(() => {
    if (departments) {
      setCount(Math.ceil(departments.length / limit));
      setDepartments(departments.slice(start * limit, (start + 1) * limit));
    }
  }, [start, departments]);
  const [success, setSuccess] = useState({
    active: false,
    message: "",
  });
  const [error, setError] = useState({
    active: false,
    message: "",
  });
  const showModalEdit = (name) => {
    setShowEditModal(true);
    setFormData({
      ...formData,
      prevName: name,
    });
  };
  const setFormValues = (e) => {
    setFormDataDelete({
      ...formDataDelete,
      [e.target.name]: e.target.value,
    });
  };
  const showModalDelete = (name) => {
    setShowDeleteModal(true);
    setFormDataDelete({
      ...formDataDelete,
      name: name,
    });
  };
  const closeModal = (e) => {
    setShowEditModal(e);
    setShowDeleteModal(e);
  };
  const getName = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const editDepartment = (e) => {
    e.preventDefault();
    setBtnLoader(true);
    fetch("/api/dashboard/departments", {
      method: "PUT",
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setSuccess({
          active: true,
          message: "Department is added.",
        });

        setTimeout(() => {
          getDepartments(userData?._id);
          setBtnLoader(false);
          setFormData("");
          setShowEditModal(false);
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
  const deleteDepartment = (e) => {
    e.preventDefault();
    setBtnLoader(true);
    fetch("/api/dashboard/departments", {
      method: "DELETE",
      body: JSON.stringify(formDataDelete),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {    
        setSuccess({
          active: true,
          message: "Department is deleted successfully.",
        });
        setTimeout(() => {
          getDepartments(userData?._id);
          setBtnLoader(false);
          setFormData("");
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
    <Wrapper className="bg-white dark:bg-gray-700 dark:border-gray-600 rounded-lg p-5 w-full">
      <Wrapper className="flex justify-between items-center mb-4">
        <H2>All Departments</H2>
      </Wrapper>
      <Wrapper className="flex bg-dark-blue dark:bg-gray-600">
        <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
          S.no
        </Wrapper>
        <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
          Department Name
        </Wrapper>
        <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
          Actions
        </Wrapper>
      </Wrapper> 
      <Wrapper className="border dark:border-gray-600 border-light-500 dark:border-gray-600 border-t-0">
        {allDepartments &&
          allDepartments.map((name, i) => (
            <Wrapper
              key={i}
              className={` flex items-center ${i} ${
                i > 0 ? "border-t dark:border-gray-600 border-light-500  dark:border-gray-600" : ""
              }`}
            >
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-dark dark:text-white capitalize">
                {start > 0 ? i + 1 + limit * start : i + 1}
              </Wrapper>
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-dark dark:text-white uppercase">
                {name}
              </Wrapper>
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-dark dark:text-white flex gap-[2px]">
                <span
                  onClick={() => showModalEdit(name)}
                  className="rounded-full w-[30px] h-[30px] bg-accent flex justify-center items-center cursor-pointer hover:scale-110"
                >
                  <IconEdit size="16px" color="fill-white" />
                </span>
                {allDepartments.length > 1 && (
                  <span
                    onClick={() => showModalDelete(name)}
                    className="rounded-full w-[30px] h-[30px] bg-red-600 flex justify-center items-center cursor-pointer hover:scale-110"
                  >
                    <IconDelete size="16px" color="fill-white" />
                  </span>
                )}
              </Wrapper>
            </Wrapper>
          ))}
      </Wrapper>
      {allDepartments?.length === 0 && (
        <Text className="text-center my-4">No Record Found.</Text>
      )}
      {allDepartments?.length > 0 && count > 1 && (
        <Pagination count={count} getIndex={handlePageChange} index={start} />
      )}
      {showEditModal && (
        <Modal
          opened={showEditModal}
          hideModal={closeModal}
          heading="Edit Department"
        >
          <Wrapper className="max-w-[510px] m-auto">
            <form className=" flex flex-col gap-4" onSubmit={editDepartment}>
              <Input
                value={formData?.name || ""}
                setData={getName}
                type="text"
                required={true}
                placeholder="Department Name"
                name="name"
                wrapperClassName="!flex-none"
                className="border border-light-600"
              >
                <IconCategory size="24px" color="fill-light-400" />
              </Input>
              <FormButton
                type="submit"
                label="Update Department"
                loading={btnLoader}
                loadingText="Updating Department"
                btnType="solid"
              ></FormButton>
              <Text className="!text-white p-2 border border-light-400 tracking-wide !font-normal">
                <strong>Note: </strong>
                If the department name is changed, the department assigned to
                all associated users will be updated automatically.
              </Text>
            </form>
          </Wrapper>
        </Modal>
      )}
      {showDeleteModal && (
        <Modal
          opened={showDeleteModal}
          hideModal={closeModal}
          heading="Are you sure you want to delete department?"
        >
          <Wrapper className="max-w-[510px] m-auto">
            <form className=" flex flex-col gap-4" onSubmit={deleteDepartment}>
              <DropDown
                items={departments?.length > 0 ? departments : department}
                required={true}
                setData={setFormValues}
                value={formDataDelete?.department || ""}
                name="department"
                placeholder={"Assign Department to user"}
              >
                <IconCategory size="24px" color="fill-light-400" />
              </DropDown>
              <FormButton
                type="submit"
                label="Delete Department"
                loading={btnLoader}
                loadingText="Deleting Department"
                btnType="solid"
              ></FormButton>
              <Text className="!text-white p-2 border border-light-400 tracking-wide !font-normal">
                If you delete a department, you must select another department
                for the affected users.
              </Text>
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
    </Wrapper>
  );
};

export default All;
