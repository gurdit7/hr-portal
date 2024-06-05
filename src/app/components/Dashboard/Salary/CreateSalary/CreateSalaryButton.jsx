'use client';
import useAuth from "@/app/contexts/Auth/auth";
import Link from "next/link";
const CreateSalaryButton = () => {
    const {userPermissions} = useAuth();
  return (
    <>
    {userPermissions && userPermissions?.includes("create-salary") && (
    <Link href='/dashboard/create-salary' className="absolute right-[25px] top-4 max-w-[250px] bg-accent w-full  rounded-lg text-base font-poppins font-medium py-[15px] text-white hover:bg-dark-blue text-center">
    Create Salary
  </Link>
    )}
    </>
  )
}

export default CreateSalaryButton
