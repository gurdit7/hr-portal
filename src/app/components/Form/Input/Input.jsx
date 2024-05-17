import PropTypes from "prop-types";
import "./style.css";
import { Children } from "react";
const Input = ({
  type,
  placeholder,
  required,
  setData,
  value,
  name,  
  children,
  className,
  onClick,
  wrapperClassName
}) => {
  let classes = `flex flex-col-reverse flex-1 relative w-full ${wrapperClassName || ''}`;
  return (
    <>
      <div className={classes}>
        <label className="pointer-events-none absolute top-[17px] left-[25px]">{children}</label>
      {onClick && ( <input
          name={name}
          type={type}
          autoComplete={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => {
            setData(e);
          }}
          onClick={(e) => {
            onClick(e);
          }}
          className={`py-[15px] pl-[61px] pr-[25px] rounded-[80px] w-full placeholder-light-600 ${className || ''} `}
        />)}
  {!onClick && (
<input
          name={name}
          type={type}
          autoComplete={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => {
            setData(e);
          }}
          className={`py-[15px] pl-[61px] pr-[25px] rounded-[80px] w-full placeholder-light-600 ${className || ''} `}
        /> )}
      </div>
    </>
  );
};
Input.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  setData: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
export default Input;
