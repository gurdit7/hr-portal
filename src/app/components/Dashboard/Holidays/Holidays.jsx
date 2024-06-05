"use client";
import { useEffect, useState } from "react";
import AddHolidays from "./AddHolidays";
import Modal from "../../Ui/Modal/Modal";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import useAuth from "@/app/contexts/Auth/auth";
import Container from "../../Ui/DashboardContainer/Container";
import FormButton from "../../Form/FormButton/FormButton";
import AllHolidays from "./AllHolidays";

const Holidays = () => {
  const { userPermissions } = useAuth();
  const [approvePopup, setApprovePopup] = useState(false);
  const closeApproveModal = (e) => {
    setApprovePopup(false);
  };
  const getApprovePopup = (e) => {
    setApprovePopup(true);
  };

  return (
    <Container heading="Holidays" className="relative">
      {userPermissions && userPermissions?.includes("add-holidays") && (
        <FormButton
          type="button"
          label="Add Holiday"
          btnType="solid"
          event={getApprovePopup}
          additionalCss="absolute right-[25px] top-4 max-w-[250px]"
        ></FormButton>
      )}
      <Wrapper className=' bg-white rounded-[10px] p-5'>
      <AllHolidays />
      </Wrapper>
      {userPermissions &&
        userPermissions?.includes("add-holidays") &&
        approvePopup && (
          <Modal
            opened={approvePopup}
            hideModal={closeApproveModal}
            heading="Add Holidays"
          >
            <Wrapper className="max-w-[510px] m-auto">
              <AddHolidays />
            </Wrapper>
          </Modal>
        )}
    </Container>
  );
};

export default Holidays;
