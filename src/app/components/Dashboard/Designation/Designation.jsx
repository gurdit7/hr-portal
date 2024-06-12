"use client";
import { useEffect } from "react";
import Container from "../../Ui/DashboardContainer/Container";
import Add from "./add/Add";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import Assign from "./assign/Assign";
import All from "./all/All";
import Wrapper from "../../Ui/Wrapper/Wrapper";

const Designation = () => {
  const { setBreadcrumbs } = useThemeConfig();
  useEffect(() => {
    const breadcrumbs = [
      {
        href: "/dashboard/designations",
        label: "Designations",
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, []);
  return (
    <Container heading="Designations">
      <Wrapper className="flex gap-4 mb-4">
        <All />
        <Assign />
      </Wrapper>

      <Add />
    </Container>
  );
};

export default Designation;
