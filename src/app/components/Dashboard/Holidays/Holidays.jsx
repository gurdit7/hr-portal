"use client";
import { useEffect, useState } from "react";
import AddHolidays from "./AddHolidays";
import Modal from "../../Ui/Modal/Modal";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import Container from "../../Ui/DashboardContainer/Container";
import FormButton from "../../Form/FormButton/FormButton";
import AllHolidays from "./AllHolidays";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";

const Holidays = () => {
  const { setBreadcrumbs } = useThemeConfig();
  const { userPermissions } = useDashboard();
  const [approvePopup, setApprovePopup] = useState(false);
  const closeApproveModal = (e) => {
    setApprovePopup(false);
  };
  const getApprovePopup = (e) => {
    setApprovePopup(true);
  };
  useEffect(() => {
    const breadcrumbs = [
      {
        href: "/dashboard/holidays",
        label: "Holidays",
      }
    ];
    setBreadcrumbs(breadcrumbs);
  }, []);
  return (
    <Container heading="Holidays" className="relative">
      {userPermissions && userPermissions?.includes("write-holidays") && (
        <FormButton
          type="button"
          label="Add Holiday"
          btnType="solid"
          event={getApprovePopup}
          additionalCss="!absolute right-[25px] top-4 max-w-[250px]"
        ></FormButton>
      )}
      <Wrapper className=' bg-white dark:bg-gray-700 dark:border-gray-600 rounded-[10px] p-5'>
      <AllHolidays />
      </Wrapper>
      {userPermissions &&
        userPermissions?.includes("read-holidays") &&
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
