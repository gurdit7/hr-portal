'use client';

import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import useAuth from "@/app/contexts/Auth/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Placeholder from '../../../../assets/images/icons/user.svg'
const ProfileImage = ({size}) => {
  const { userData } = useAuth();
  const [_image, setImage] = useState(Placeholder.src);
  useEffect(() => {
    setImage(userData?.profileImage);
  }, [userData]);

  return (
  <Wrapper className='flex items-center justify-center'>
    <Link href='/dashboard/profile'>
        {_image === '' && (<svg width={size} height={size} viewBox="0 0 512 512" fill="none" className="block  transition-all duration-200" >
<path d="M256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48ZM256 446.7C197.4 446.7 144.9 420.1 109.9 378.4C127.7 370.7 172.1 354.7 200.2 346.5C202.4 345.8 202.8 345.7 202.8 335.8C202.8 325.2 201.6 317.7 199 312.2C195.5 304.7 191.3 292 189.8 280.6C185.6 275.7 179.9 266.1 176.2 247.7C173 231.5 174.5 225.6 176.6 220.1C176.8 219.5 177.1 218.9 177.2 218.3C178 214.6 176.9 194.8 174.1 179.5C172.2 169 174.6 146.7 189.1 128.2C198.2 116.5 215.7 102.2 247.1 100.2H264.6C296.5 102.2 314 116.5 323.1 128.2C337.6 146.7 340 169 338 179.5C335.2 194.8 334.1 214.5 334.9 218.3C335 218.9 335.3 219.5 335.5 220C337.6 225.5 339.2 231.4 335.9 247.6C332.2 266 326.5 275.6 322.3 280.5C320.8 291.9 316.6 304.5 313.1 312.1C309.8 319 306.5 327.2 306.5 335.4C306.5 345.3 306.9 345.4 309.2 346.1C335.9 354 381.9 369.9 402.2 378.2C367.2 420 314.7 446.7 256 446.7Z" fill="#F4F6FD"/>
</svg>
)}
</Link>
{_image !== '' && (
<Wrapper className='border border-dark rounded-full p-[5px]'>
<Image src={_image || Placeholder.src} alt="Profile Image" width={size} height={size} className="h-auto transition-all duration-200 border border-light-500 rounded-full" />
</Wrapper>
) }

</Wrapper>
  );
}

export default ProfileImage;
