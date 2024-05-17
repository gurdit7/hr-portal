'use client'
import { useEffect } from "react";
import { useRouter,usePathname } from "next/navigation";
import useAuth from "@/app/contexts/Auth/auth";

const GetUserData = (session) => {
    const {setUserData, setUserLoggedIn, setPermissions} = useAuth();
    const router = useRouter();
    const location = usePathname();
    useEffect(()=>{
        if(session.session !== "null"){
        const user = JSON.parse(session.session);

        fetch("/api/dashboard/user-data", {
          method: "POST",
          body: JSON.stringify({userID:user?.userID}),
        })
          .then(function (res) {
            return res.json();
          })
          .then(async function (data) {
            setUserData(data?.user);
            setPermissions(data?.permissions);
          });
        setTimeout(() => {
          setUserLoggedIn(true)
        }, 2000);

        if(location === '/account/register' || location === '/account/login'){
          router.push('/', { scroll: false })
        }
        }
        else{
            if(location === '/account/register' || location === '/account/login'){

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
