import React from 'react';

const H1 = ({tag, children, classname}) => {
    classname = classname || '';
  return (
    <>
    {tag && (<h1 className={classname +  ' font-poppins font-medium text-[48px] leading-[1.5]'}>{children}</h1>)}
    {!tag && (<div className={classname + ' font-poppins font-medium text-[48px] '}>{children}</div>)}
    </>
  );
}

export default H1;
