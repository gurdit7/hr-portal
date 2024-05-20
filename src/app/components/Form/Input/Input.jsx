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
  multiple,
  wrapperClassName
}) => {
  let classes = `flex flex-col-reverse flex-1 relative w-full font-medium ${wrapperClassName || ''}`;
  return (
    <>
      <div className={classes}>
        <label className={ `pointer-events-none absolute left-[25px] ${type === 'file' ? " top-[19px]" : " top-[17px]"} `}>{children}</label>
      {onClick && type !== 'file' &&  ( <input
          name={name}
          type={type}
          autoComplete={type}
          placeholder={placeholder}
          required={required}
          value={value}
          multiple={multiple || false}
          onChange={(e) => {
            setData(e);
          }}
          onClick={(e) => {
            onClick(e);
          }}
          className={`py-[15px] pl-[61px] pr-[25px] rounded-[80px] w-full placeholder-light-600 ${className || ''} `}
        />)}
  {!onClick && type !== 'file' && (
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

{onClick && type === 'file' &&  ( 
<div className="rounded-[80px] border-light-600 border relative">
<input
          name={name}
          type={type}
          autoComplete={type}
          placeholder={placeholder}
          required={required}
          value={value}
          multiple={multiple || false}
          onChange={(e) => {
            setData(e);
          }}
          onClick={(e) => {
            onClick(e);
          }}
          className={`py-[15px] pl-[61px] pr-[25px] rounded-[80px] w-full placeholder-light-600 opacity-0 ${className || ''} `}
        />
        <span className="absolute text-light-600 top-[19px] left-16">{placeholder}</span>
        </div>
        
        )}
  {!onClick && type === 'file' && (
    <div className="rounded-[80px] border-light-600 border relative">
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
          className={`py-[15px] pl-[61px] pr-[25px]  w-full placeholder-light-600  opacity-0  ${className || ''} `}
        />
        <span className="absolute text-light-600 top-[19px] left-16">{placeholder}</span>
        </div> )}
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
