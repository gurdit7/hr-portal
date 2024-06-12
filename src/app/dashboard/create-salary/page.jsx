import CreateSalary from "@/app/components/Dashboard/Salary/CreateSalary/CreateSalary";
import Container from "@/app/components/Ui/DashboardContainer/Container";
export const metadata = {
  title: "Create Salary - Hr Portal",
  description: "Generated by create next app",
};
const page = () => {
  return (
    <Container heading="Create Salary" className="relative">
      <CreateSalary />
    </Container>
  );
}

export default page;
