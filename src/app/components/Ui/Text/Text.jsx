import PropTypes from 'prop-types';
function Text({children , className}) {
  return (
    <>
    {className === "" && (<p className={''}>
        {children}
     </p>     )}
     {className !== "" && (<p className={className}>
        {children}
     </p>     )}
     </>
  );
}

Text.propTypes={
    className: PropTypes.string
}
export default Text;
