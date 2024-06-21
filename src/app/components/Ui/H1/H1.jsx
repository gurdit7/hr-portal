import React from 'react';

const H1 = ({tag, children, className}) => {
    className = className || '';
  return (
    <>
    {tag && (<h1 className={className +  ' font-poppins font-semibold text-[48px] leading-[1.5] dark:text-white '}>{children}</h1>)}
    {!tag && (<div className={className + ' font-poppins font-semibold text-[48px] dark:text-white '}>{children}</div>)}
    </>
  );
}

export default H1;
