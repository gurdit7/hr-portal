"use client";
import PropTypes from "prop-types";
import "./style.css";
import Wrapper from "../../Ui/Wrapper/Wrapper";
const DropDown = ({
  label,
  name,
  placeholder,
  items,
  required,
  setData,
  value,
  children
}) => {
  return (
    <Wrapper className="flex flex-col-reverse flex-1 relative">
      <select
        value={value || placeholder}
        onChange={(e) => {
          setData(e);
        }}
        required={required}
        name={name}
        className="text-base placeholder:text-c-gray-400 pl-[61px] border border-light-600 rounded-[60px]  font-medium text-light-600 p-4 max-sm:p-2 dark:bg-transparent"
      >
        <option disabled data-index="0" value={placeholder}>
          {placeholder}
        </option>
        {items.map((item, index) => (
          <option value={item} key={index} data-index={index + 1} className="text-text-dark">
            {item}
          </option>
        ))}
      </select>
     {children && (<label className="pointer-events-none absolute top-[15px] left-[25px]">{children}</label>) } 
      {label && (
        <label className="block font-medium text-c-gray-600  text-base mb-2 text-light-600">
          {label}
        </label>
      )}
    </Wrapper>
  );
};

DropDown.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
};
export default DropDown;
