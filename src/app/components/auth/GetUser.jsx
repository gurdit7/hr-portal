'use client'
import { useEffect } from "react";
import { useRouter,usePathname } from "next/navigation";
import useAuth from "@/app/contexts/Auth/auth";

const GetUserData = (session) => {
    const {setUserData} = useAuth();
    const router = useRouter();
    const location = usePathname();
    useEffect(()=>{
        if(session.session !== "null"){
        setUserData(JSON.parse(session.session))
        }
        else{
            if(location === '/' || location === '/account/register' || location === '/account/login'){

            }
            else{
                router.push('/account/login', { scroll: false })
            }
        }
    },[session])
  return (
<></>
  );
}

export default GetUserData;
