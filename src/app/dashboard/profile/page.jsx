import Container from "@/app/components/Ui/DashboardContainer/Container";
import "./style.css";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import CoverImage from "@/app/components/Dashboard/Profile/CoverImage/CoverImage";
import ProfileLeft from "@/app/components/Dashboard/Profile/ProfileLeft/ProfileLeft";
import ProfileCenter from "@/app/components/Dashboard/Profile/ProfileCenter/ProfileCenter";
import ProfileRight from "@/app/components/Dashboard/Profile/ProfileRight/ProfileRight";

const page = () => {
  return (
    <Container heading="My Profile">
      <Wrapper className="flex justify-between gap-[15px]">
        <CoverImage/>
      </Wrapper>
      <Wrapper className='flex w-full gap-[15px] -mt-[50px] relative z-[1] px-[15px]'>
        <ProfileLeft/>
        <ProfileCenter/>
        <ProfileRight heading="Salary" button={true} />
      </Wrapper>
    </Container>
  );
};

export default page;
