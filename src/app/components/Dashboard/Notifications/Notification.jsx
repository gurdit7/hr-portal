'use client'
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import Container from "@/app/components/Ui/DashboardContainer/Container";
import RecentNotifications from "@/app/components/Dashboard/Notifications/RecentNotifications";
import AddNotification from "@/app/components/Dashboard/Notifications/AddNotification";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import { useEffect } from "react";


const Notification = () => {
    const { setBreadcrumbs } = useThemeConfig();
    useEffect(() => {
      const breadcrumbs = [
        {
          href: "/dashboard/notifications",
          label: "Notifications",
        }
      ];
      setBreadcrumbs(breadcrumbs);
    }, []);
  return (
 <>
 <Container heading='Notifications'>
  <Wrapper className='flex justify-between gap-[15px]'>
  <RecentNotifications/>
  <AddNotification/>
 </Wrapper>
 </Container>
 </>
  );
};

export default Notification;
