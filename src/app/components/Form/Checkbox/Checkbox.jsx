import React from 'react';
import Wrapper from '../../Ui/Wrapper/Wrapper';

const Checkbox = ({value, label, id, onChange, checked}) => {
  return (
    <Wrapper className="flex gap-2 items-center">
    <input
      type="checkbox"
      name="permissions"
      value={value}
      id={id}
      checked={checked}
      onChange={(e)=>onChange(e)}
      className="cursor-pointer hidden peer"
    />
    <span className={`${checked ? 'bg-dark-blue border-dark-blue dark:border-gray-400 dark:bg-gray-400' : 'border border-light-400 dark:border-gray-400'} w-5 h-5 flex items-center justify-center rounded-[4px]  `}>
      {checked && (
   <svg height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff" className='block'><path d="M389-248.91 176.91-460l69.66-70.65L389-388.22l324.43-323.43L783.09-642 389-248.91Z"/></svg>
  )}
    </span>
    <label htmlFor={id} className="cursor-pointer text-sm relative before:absolute before:w-5 before:h-5 before:-left-[30px] before:top-0 text-white">
    {label && label.replace('-', ' ')}
    </label>
  </Wrapper>
  );
}

export default Checkbox;
