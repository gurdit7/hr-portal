"use client";
import { useEffect, useState } from "react";
import { useThemeConfig } from "@/app/contexts/theme/ThemeConfigure";
import Container from "../../Ui/DashboardContainer/Container";
import Wrapper from "../../Ui/Wrapper/Wrapper";
import { formatDate } from "@/app/utils/DateFormat";
import Input from "../../Form/Input/Input";
import IconSearch from "../../Icons/IconSearch";
import H2 from "../../Ui/H2/H2";
import { useDashboard } from "@/app/contexts/Dashboard/dashboard";
import Pagination from "../../Ui/Pagination/Pagination";
import Text from "../../Ui/Text/Text";

const Team = () => {
  const { teamMembers } = useDashboard();
  const { setBreadcrumbs } = useThemeConfig();
  const limit = 10;
  const [allMembers, setAllMembers] = useState([]);
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(0);
  let [search, setSearch] = useState("");
  useEffect(() => {
    const breadcrumbs = [
      {
        href: "/dashboard/team",
        label: "My Team",
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, []);

  const handlePageChange = (e) => {
    setStart(e);
  };
  const getSearch = (e) => {
    setSearch(e.target.value);
  };
  useEffect(() => {
    if (search !== "") {
      let filteredUsers = teamMembers?.members.filter((user) => {
        const name = user.name.toLowerCase();
        const userType = user.userType.toLowerCase();
        const email = user.email.toLowerCase();
        const designation = user.designation.toLowerCase();
        const gender = user.gender.toLowerCase();
        search = search.toLowerCase();
        return (
          name.includes(search) ||
          userType.includes(search) ||
          email.includes(search) ||
          designation.includes(search) ||
          gender.includes(search)
        );
      });
      setCount(Math.ceil(filteredUsers.length / limit));
      setAllMembers(     
        filteredUsers.slice(start * limit,  (start + 1) * limit)
      );
    } else {
      if(teamMembers){
      setCount(Math.ceil(teamMembers?.members.length / limit));
      setAllMembers(teamMembers?.members.slice(start * limit,  (start + 1) * limit));
      }
    }
  }, [search, start, teamMembers]);
  return (
    <Container heading="My Team">
      <Wrapper className="p-5 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-[10px] flex flex-col gap-[0px] w-full">
        <Wrapper className="flex justify-between items-center">
          <H2>All Memebers</H2>
          <Wrapper>
            <Input
              type="text"
              placeholder="Search"
              value={search}
              setData={getSearch}
              name="Search"
              wrapperClassName="!flex-none"
              className="border border-light-600"
            >
              <IconSearch size="24px" color="fill-light-400" />
            </Input>
          </Wrapper>
        </Wrapper>

        <table className="table-fixed mt-4">
          <thead>
            <tr className=" bg-dark-blue">
              <th className=" text-sm font-medium font-poppins p-[10px] text-white text-left">
                S.no
              </th>
              <th className=" text-sm font-medium font-poppins p-[10px] text-white text-left">
                {" "}
                User Type
              </th>
              <th className=" text-sm font-medium font-poppins p-[10px] text-white text-left">
                Name
              </th>
              <th className=" text-sm font-medium font-poppins p-[10px] text-white text-left">
                Email
              </th>
              <th className=" text-sm font-medium font-poppins p-[10px] text-white text-left">
                Designation
              </th>
              <th className=" text-sm font-medium font-poppins p-[10px] text-white text-left">
                Gender
              </th>
              <th className=" text-sm font-medium font-poppins p-[10px] text-white text-left">
                DOB
              </th>
              <th className=" text-sm font-medium font-poppins p-[10px] text-white text-left">
                Increment Date
              </th>
              <th className=" text-sm font-medium font-poppins p-[10px] text-white text-left">
                Join Date
              </th>
            </tr>
          </thead>
          <tbody className="border dark:border-gray-600 border-light-500 border-t-0">
            {allMembers &&
              allMembers.map((user, i) => (
                <tr
                  key={i}
                  className={` items-center ${
                    i > 0 ? "border-t dark:border-gray-600 border-light-500" : ""
                  }`}
                >
                  <td className=" text-sm font-medium font-poppins p-[10px] text-dark dark:text-white capitalize">
                    {start > 0 ? i + 1 + limit * start : i + 1}
                  </td>
                  <td className=" text-sm font-medium font-poppins p-[10px] text-dark dark:text-white capitalize">
                    {user.userType}
                  </td>
                  <td className=" text-sm font-medium font-poppins p-[10px] text-dark dark:text-white capitalize">
                    {user.name}
                  </td>
                  <td className=" text-sm font-medium font-poppins p-[10px] text-dark dark:text-white">
                    {user.email}
                  </td>
                  <td className=" text-sm font-medium font-poppins p-[10px] text-dark dark:text-white capitalize">
                    {user.designation}
                  </td>

                  <td className=" text-sm font-medium font-poppins p-[10px] text-dark dark:text-white capitalize">
                    {user.gender}
                  </td>
                  <td className=" text-sm font-medium font-poppins p-[10px] text-dark dark:text-white capitalize">
                    {formatDate(user.DOB)}
                  </td>
                  <td className=" text-sm font-medium font-poppins p-[10px] text-dark dark:text-white capitalize">
                    {formatDate(user.incrementDate)}
                  </td>
                  <td className=" text-sm font-medium font-poppins p-[10px] text-dark dark:text-white capitalize">
                    {formatDate(user.joinDate)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {allMembers?.length === 0 && (
          <Text className="text-center my-4">No Record Found.</Text>
        )}
        {allMembers?.length > 0 && count > 1 && (
          <Pagination count={count} getIndex={handlePageChange} index={start} />
        )}
      </Wrapper>
    </Container>
  );
};

export default Team;
