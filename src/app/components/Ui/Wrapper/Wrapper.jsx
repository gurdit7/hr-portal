import React from 'react';

const Wrapper = ({children,classname}) => {
  return (
    <div className={classname}>
      {children}
    </div>
  );
}

export default Wrapper;
