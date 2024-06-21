"use client";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import ItemRecentNotifications from "./ItemRecentNotifications";
const RecentNotifications = () => {
  const { userNotifications, userIndividualNotifications, userPermissions } =
    useDashboard();
  return (
    <>
      <Wrapper className="p-5 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-[10px] flex flex-col gap-[15px] w-full">
        {userPermissions &&
          userPermissions?.includes("view-users-notifications") && (
            <ItemRecentNotifications
            heading="Recent Notification"
            userNotifications={userNotifications} />
          )}
        {userPermissions && userPermissions?.includes("user-notifications") && (
          <ItemRecentNotifications
          heading="My Notification"
            userNotifications={userIndividualNotifications}
          />
        )}
      </Wrapper>
    </>
  );
};

export default RecentNotifications;
