"use client";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import Container from "../../Ui/DashboardContainer/Container";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import Add from "./Add/Add";
import { useEffect } from "react";
import Assign from "./Assign/Assign";
import All from "./All/All";

const Roles = () => {
  const { setBreadcrumbs } = useThemeConfig();
  useEffect(() => {
    const breadcrumbs = [
      {
        href: "/dashboard/roles",
        label: "Roles",
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, []);
  return (
    <Container heading="Roles">
      <Wrapper className="flex gap-4 mb-4">
       <All/> <Add />
      </Wrapper>
      <Wrapper>
      <Assign />
      </Wrapper>
    </Container>
  );
};

export default Roles;
