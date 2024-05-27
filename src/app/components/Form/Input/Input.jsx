import PropTypes from "prop-types";
import "./style.css";
import { Children } from "react";
import Wrapper from "../../Ui/Wrapper/Wrapper";
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
  wrapperClassName,
}) => {
  let classes = `flex flex-col-reverse flex-1 relative w-full font-medium ${
    wrapperClassName || ""
  }`;
  return (
    <>
      <div className={classes}>
        <Wrapper className="relative flex">
          <label
            className={`pointer-events-none absolute left-[15px] ${
              type === "file" ? " top-[16px]" : " top-[16px]"
            } `}
          >
            {children}
          </label>
          {onClick && type !== "file" && (
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
              className={`py-[15px] pl-[48px] pr-[25px] rounded-lg w-full placeholder-light-600 ${
                className || ""
              } `}
            />
          )}

          {!onClick && type !== "file" && (
            <input
              name={name}
              type={type}
              autoComplete={type}
              required={required}
              placeholder={placeholder}
              value={value}
              onChange={(e) => {
                setData(e);
              }}
              className={`py-[15px] pl-[48px] pr-[25px]  rounded-lg w-full placeholder-light-600 peer ${
                className || ""
              } `}
            />
          )}
        </Wrapper>
        <span className="text-light-400 text-xs block mb-1">{placeholder}</span>
        {onClick && type === "file" && (
          <div className=" rounded-lg border-light-600 border relative">
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
              className={`py-[15px] pl-[61px] pr-[25px]  rounded-lg w-full placeholder-light-600 opacity-0 ${
                className || ""
              } `}
            />
            <span className="absolute text-light-600 top-[19px] left-16">
              {placeholder}
            </span>
          </div>
        )}
        {!onClick && type === "file" && (
          <div className=" rounded-lg border-light-600 border relative">
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
              className={`py-[15px] pl-[61px] pr-[25px]  w-full placeholder-light-600  opacity-0  ${
                className || ""
              } `}
            />

            <span className="absolute text-light-600 top-[19px] left-16">
              {placeholder}
            </span>
          </div>
        )}
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
