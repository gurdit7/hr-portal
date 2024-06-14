"use client";

import DropDown from "@/app/components/Form/DropDown/select";
import FormButton from "@/app/components/Form/FormButton/FormButton";
import Input from "@/app/components/Form/Input/Input";
import IconCategory from "@/app/components/Icons/IconCategory";
import IconDelete from "@/app/components/Icons/IconDelete";
import IconEdit from "@/app/components/Icons/IconEdit";
import H2 from "@/app/components/Ui/H2/H2";
import Modal from "@/app/components/Ui/Modal/Modal";
import Text from "@/app/components/Ui/Text/Text";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import ErrorNotification from "@/app/components/Ui/notification/loader/LoaderNotification";
import Notification from "@/app/components/Ui/notification/success/Notification";
import useAuth from "@/app/contexts/Auth/auth";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import { useEffect, useState } from "react";
import Permissions from "../Add/Permissions";
import Pagination from "@/app/components/Ui/Pagination/Pagination";

const All = () => {
  const { userData } = useAuth();
  const { userRoles, getUserRoles, allPermissions } = useDashboard();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState("");
  const [newPermissions, setNewPermissions] = useState("");
  const [formDataDelete, setFormDataDelete] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const limit = 10;
  const [allRoles, setAllRoles] = useState([]);
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(0);
  const handlePageChange = (e) => {
    setStart(e);
  };  
  useEffect(() => {
    if (userRoles) {
      setCount(Math.ceil(userRoles.length / limit));
      setAllRoles(userRoles.slice(start * limit, (start + 1) * limit));
    }
  }, [start, userRoles]);
  const hideNotifications = () =>{
    setTimeout(() => {
      setError({
        active: false,
        message: "",
      });
      setSuccess({
        active: false,
        message: "",
      });
    }, 3000);
  }
  const getFormData = (e) => {
    setNewPermissions(e)
  };
  const [success, setSuccess] = useState({
    active: false,
    message: "",
  });
  const [error, setError] = useState({
    active: false,
    message: "",
  });
  const showModalEdit = (name, permissions) => {
    const per = permissions.filter((item) => {
      if (item.role === name) {
        return item.permissions;
      }
    });
    setFormData({
        ...formData,
        name: name,
        key:`${userData?._id}`, 
        permissions: per[0]?.permissions,
      });
    setShowEditModal(true);
 
  };
  const setFormValues = (e) => {
    setFormDataDelete({
      ...formDataDelete,
      key:`${userData?._id}`, 
      [e.target.name]: e.target.value,
    });
  };
  const showModalDelete = (name) => {
    setShowDeleteModal(true);
    setFormDataDelete({
      ...formDataDelete,
      key:`${userData?._id}`, 
      name: name,
    });
  };
  const closeModal = (e) => {
    setShowEditModal(e);
    setShowDeleteModal(e);
  };
  const editDepartment = (e) => {
    e.preventDefault();
    setBtnLoader(true);
    const selectedPermissions = [];
    Object.keys(newPermissions).forEach((key) => {
      const value = newPermissions[key];
      if (value === true) {
        selectedPermissions.push(key);
      }
    }); 
    if(selectedPermissions.length > 0){
    fetch("/api/dashboard/roles", {
      method: "PUT",
      body: JSON.stringify({newPermissions:selectedPermissions,name:formData?.name, key:formData?.key }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setSuccess({
          active: true,
          message: "Role is Updated.",
        });

        setTimeout(() => {
          getUserRoles(userData?._id);
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
    }
    else{
        setBtnLoader(false)
        setError({
          active: true,
          message: "Please select a value.",
        });
        hideNotifications();
      }
  };
  const deleteDepartment = (e) => {
    e.preventDefault();
    setBtnLoader(true);
    fetch("/api/dashboard/roles", {
      method: "DELETE",
      body: JSON.stringify(formDataDelete),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setSuccess({
          active: true,
          message: "Role is deleted successfully.",
        });
        setTimeout(() => {
          getUserRoles(userData?._id);
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
    <Wrapper className="bg-white rounded-lg p-5 w-full">
      <Wrapper className="flex justify-between items-center mb-4">
        <H2>All Roles</H2>
      </Wrapper>
      <Wrapper className="flex bg-dark-blue">
        <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
          S.no
        </Wrapper>
        <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
          Role Name
        </Wrapper>
        <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
          Actions
        </Wrapper>
      </Wrapper>
      <Wrapper className="border border-light-500 border-t-0">
        {allRoles &&
          allRoles.map((name, i) => (
            <Wrapper
              key={i}
              className={` flex items-center ${i} ${
                i > 0 ? "border-t border-light-500" : ""
              }`}
            >
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize">
              {start > 0 ? i + 1 + limit * start : i + 1}
              </Wrapper>
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark uppercase">
                {name.replace("-", " ")}
              </Wrapper>
              <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark flex gap-[2px]">
                <span
                  onClick={() => showModalEdit(name, allPermissions)}
                  className="rounded-full w-[30px] h-[30px] bg-accent flex justify-center items-center cursor-pointer hover:scale-110"
                >
                  <IconEdit size="16px" color="fill-white" />
                </span>
                {allRoles.length > 1 && (
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
      {userRoles?.length === 0 && (
        <Text className="text-center my-4">No Record Found.</Text>
      )}
      {userRoles?.length > 0 && count > 1 && (
        <Pagination count={count} getIndex={handlePageChange} index={start} />
      )}
      {showEditModal && (
        <Modal
          opened={showEditModal}
          hideModal={closeModal}
          heading="Edit Role"
        >
          <Wrapper className="max-w-[510px] m-auto">
          <form className=" flex flex-col gap-4" onSubmit={editDepartment}>
            <Permissions getFormData={getFormData} selectedPermissions={formData?.permissions} />
            <FormButton
                type="submit"
                label="Update Permissions"
                loading={btnLoader}
                loadingText="Updating"
                btnType="solid"
              ></FormButton>
            </form> 
          </Wrapper>
        </Modal>
      )}
      {showDeleteModal && (
        <Modal
          opened={showDeleteModal}
          hideModal={closeModal}
          heading="Are you sure you want to delete Role?"
        >
          <Wrapper className="max-w-[510px] m-auto">
            <form className=" flex flex-col gap-4" onSubmit={deleteDepartment}>
              <DropDown
                items={userRoles}
                required={true}
                setData={setFormValues}
                value={formDataDelete?.role || ""}
                name="role"
                placeholder={"Assign New Role to users"}
              >
                <IconCategory size="24px" color="fill-light-400" />
              </DropDown>
              <FormButton
                type="submit"
                label="Delete Role"
                loading={btnLoader}
                loadingText="Deleting Role"
                btnType="solid"
              ></FormButton>
              <Text className="!text-white p-2 border border-light-400 tracking-wide !font-normal">
                If you delete a Role, you must select another Role for the
                affected users.
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
