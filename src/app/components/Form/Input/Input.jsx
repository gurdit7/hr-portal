import PropTypes from "prop-types";
import "./style.css";
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
  inputClasses
}) => {
  const commonClasses = `py-[15px] pl-[48px] pr-[25px] rounded-lg w-full placeholder-light-600 ${inputClasses || ""} ${className}`;
  const fileClasses = `relative border-light-600  rounded-lg border ${className || ""}`;
  const classes = `flex flex-col-reverse flex-1 relative w-full font-medium ${wrapperClassName || ""}`;

  return (
    <div className={classes}>
      {type !== "file" ? (
        <>        
          <Wrapper className="relative flex">
            <label className="pointer-events-none absolute left-[15px] top-[16px]">
              {children}
            </label>
            <input
              name={name}
              type={type}
              autoComplete={type}
              placeholder={placeholder}
              required={required}
              value={value}
              multiple={multiple || false}
              onChange={(e) => setData(e)}
              onClick={onClick}
              className={`${commonClasses} ${onClick ? "" : "peer"}`}
            />
          </Wrapper>
          <span className="text-light-400 text-xs block mb-1">{placeholder}</span>
        </>
      ) : (
        <Wrapper>
        <span className="text-light-400 text-xs block mb-1">Add Attachment</span>
        <Wrapper className="relative">
          <label className="pointer-events-none absolute left-[15px] top-[20px]">
            {children}
          </label>
          <div className={fileClasses}>
            <input
              name={name}
              type={type}
              autoComplete={type}
              placeholder={placeholder}
              required={required}
              value={value}
              multiple={multiple || false}
              onChange={(e) => setData(e)}
              onClick={onClick}
              className={`${commonClasses} opacity-0`}
            />
            <span className="absolute text-light-600 top-[19px] left-12 pointer-events-none">
              {placeholder}
            </span>
          </div>
        </Wrapper>
        </Wrapper>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  setData: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  multiple: PropTypes.bool,
  wrapperClassName: PropTypes.string,
};

export default Input;
