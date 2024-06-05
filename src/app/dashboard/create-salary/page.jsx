import CreateSalary from "@/app/components/Dashboard/Salary/CreateSalary/CreateSalary";
import Container from "@/app/components/Ui/DashboardContainer/Container";

const page = () => {
  return (
    <Container heading="Create Salary" className="relative">
      <CreateSalary />
    </Container>
  );
}

export default page;
