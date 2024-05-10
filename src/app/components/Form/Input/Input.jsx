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
  children
}) => {
  let classes = "flex flex-col-reverse flex-1 relative w-full";
  return (
    <>
      <div className={classes}>
        <label className="pointer-events-none absolute top-[15px] left-[25px]">{children}</label>
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
          className="py-[15px] pl-[61px] pr-[25px] rounded-[80px] w-full placeholder-#C2C3CB"
        />
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
