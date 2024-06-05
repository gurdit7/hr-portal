import Container from '@/app/components/Ui/DashboardContainer/Container';
import './style.css';
import Wrapper from '@/app/components/Ui/Wrapper/Wrapper';
import ProfileRight from '@/app/components/Dashboard/Profile/ProfileRight/ProfileRight';
import RequestDocuments from '@/app/components/Dashboard/Salary/RequestDocuments/RequestDocuments';
import AppraisalForm from '@/app/components/Dashboard/Salary/AppraisalForm/AppraisalForm';
import CreateSalaryButton from '@/app/components/Dashboard/Salary/CreateSalary/CreateSalaryButton';

const page = () => {
  return (
    <Container heading="Salary" className='relative'>
    <CreateSalaryButton />
    <Wrapper className='flex w-full gap-[15px] relative z-[1] '>
      <Wrapper className='max-w-[313px] w-full bg-white rounded-[10px]'>
        <ProfileRight heading="Information" button={false}/>
        </Wrapper>
        <RequestDocuments/>
        <AppraisalForm/>
    </Wrapper>
  </Container>
  )
}

export default page
