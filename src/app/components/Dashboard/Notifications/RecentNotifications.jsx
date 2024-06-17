"use client";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import ItemRecentNotifications from "./ItemRecentNotifications";
const RecentNotifications = () => {
  const { userNotifications, userIndividualNotifications, userPermissions } =
    useDashboard();
  return (
    <>
      <Wrapper className="p-5 bg-white rounded-[10px] flex flex-col gap-[15px] w-full">
        {userPermissions &&
          userPermissions?.includes("view-users-notifications") && (
            <ItemRecentNotifications userNotifications={userNotifications} />
          )}
        {userPermissions && userPermissions?.includes("user-notifications") && (
          <ItemRecentNotifications
            userNotifications={userIndividualNotifications}
          />
        )}
      </Wrapper>
    </>
  );
};

export default RecentNotifications;
