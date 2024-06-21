import DocumentInformation from "@/app/components/Dashboard/Salary/RequestDocuments/DocumentInformation";
import Container from "@/app/components/Ui/DashboardContainer/Container";
import React from "react";

const page = () => {
  return (
    <Container heading="Document Information">
      <DocumentInformation />
    </Container>
  );
};

export default page;
