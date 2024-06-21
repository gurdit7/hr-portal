'use client';
import PropTypes from "prop-types";
import "./style.css";
import { useState } from "react";
import Wrapper from "../../Ui/Wrapper/Wrapper";
const Password = ({
  required,
  setData,
  value,
  name,  
  children,
  label
}) => {
  const [view,setView] = useState(false);
  const viewClicked = (e)=>{
    setView(prevState => !prevState)
  }
  const onChange = (e)=>{
    setData(e);
    setView(false)
  }
  let classes = "flex flex-col-reverse flex-1 relative w-full";
  return (
    <>
    <Wrapper>
    <span className="text-light-400 text-xs block mb-1">
      {label}
      </span>
 
      <div className={classes}>
        <label className="pointer-events-none absolute top-[15px] left-[15px]">{children}</label>
        <input
          name={name}
          type={`${view ? 'text' : 'password'}`}
          required={required}
          value={value}
          autoComplete=""
          onChange={onChange}
          className="py-[15px] pl-[48px] pr-[25px] rounded-lg w-full dark:text-white placeholder-#C2C3CB dark:bg-gray-700"
        />
        {!value && (        <span className="absolute top-[23px] left-[48px] pointer-events-none"><svg width="118" height="8" viewBox="0 0 118 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="3.51017" cy="4" rx="3.51017" ry="3.5" fill="#C2C3CB"/>
<ellipse cx="14.5422" cy="4" rx="3.51017" ry="3.5" fill="#C2C3CB"/>
<ellipse cx="25.5741" cy="4" rx="3.51017" ry="3.5" fill="#C2C3CB"/>
<ellipse cx="36.6061" cy="4" rx="3.51017" ry="3.5" fill="#C2C3CB"/>
<ellipse cx="47.6381" cy="4" rx="3.51017" ry="3.5" fill="#C2C3CB"/>
<ellipse cx="58.6701" cy="4" rx="3.51017" ry="3.5" fill="#C2C3CB"/>
<ellipse cx="69.7021" cy="4" rx="3.51017" ry="3.5" fill="#C2C3CB"/>
<ellipse cx="80.7341" cy="4" rx="3.51017" ry="3.5" fill="#C2C3CB"/>
<ellipse cx="91.766" cy="4" rx="3.51017" ry="3.5" fill="#C2C3CB"/>
<ellipse cx="102.798" cy="4" rx="3.51017" ry="3.5" fill="#C2C3CB"/>
<ellipse cx="113.83" cy="4" rx="3.51017" ry="3.5" fill="#C2C3CB"/>
</svg>
</span>)}
<button className="right-[25px] absolute top-[15px]" type="button" onClick={viewClicked}>
  {view && (<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.2505 16.6301C12.4381 16.8401 11.5957 16.9401 10.7232 16.9401C7.44367 16.9401 4.50516 15.4101 2.49934 12.9901C1.09527 11.3001 1.09527 8.69006 2.49934 7.01006C2.65981 6.81006 2.84033 6.62005 3.02085 6.43005" stroke="#C2C3CB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M18.947 12.9901C18.1447 13.9501 17.192 14.7701 16.1389 15.4101L5.29749 4.59006C6.89211 3.61006 8.73746 3.06006 10.7232 3.06006C14.0027 3.06006 16.9412 4.59006 18.947 7.01006C20.3511 8.69006 20.3511 11.3101 18.947 12.9901Z" stroke="#C2C3CB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13.8122 10C13.8122 10.85 13.4611 11.62 12.9095 12.18L8.53687 7.82005C9.08846 7.26005 9.87073 6.92004 10.7232 6.92004C12.4382 6.92004 13.8122 8.29005 13.8122 10Z" stroke="#C2C3CB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M1.44629 0.75L5.29745 4.59L8.53684 7.82L12.9095 12.18L16.1489 15.41L20.0001 19.25" stroke="#C2C3CB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
) }
{!view && (<svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 6.5C15.79 6.5 19.17 8.63 20.82 12C19.17 15.37 15.79 17.5 12 17.5C8.21 17.5 4.83 15.37 3.18 12C4.83 8.63 8.21 6.5 12 6.5ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 9.5C13.38 9.5 14.5 10.62 14.5 12C14.5 13.38 13.38 14.5 12 14.5C10.62 14.5 9.5 13.38 9.5 12C9.5 10.62 10.62 9.5 12 9.5ZM12 7.5C9.52 7.5 7.5 9.52 7.5 12C7.5 14.48 9.52 16.5 12 16.5C14.48 16.5 16.5 14.48 16.5 12C16.5 9.52 14.48 7.5 12 7.5Z" fill="#C2C3CB"/>
</svg>
) }

</button>
      </div>
      </Wrapper>
    </>
  );
};
Password.propTypes = {
  required: PropTypes.bool,
  setData: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
export default Password;
