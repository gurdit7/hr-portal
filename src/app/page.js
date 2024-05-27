import Image from "next/image";
import Link from "next/link";
import Container from "./components/Ui/DashboardContainer/Container";
import Employees from "./components/Dashboard/Home/Employees";
import Leaves from "./components/Dashboard/Leaves/Leaves";

export default function Home() {
  return (
<>
<Employees/>
</>
  );
}
