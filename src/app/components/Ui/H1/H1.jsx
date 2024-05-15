import React from 'react';

const H1 = ({tag, children, className}) => {
    className = className || '';
  return (
    <>
    {tag && (<h1 className={className +  ' font-poppins font-medium text-[48px] leading-[1.5]'}>{children}</h1>)}
    {!tag && (<div className={className + ' font-poppins font-medium text-[48px] '}>{children}</div>)}
    </>
  );
}

export default H1;
