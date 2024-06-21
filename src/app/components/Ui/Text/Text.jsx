import PropTypes from 'prop-types';
function Text({children , className}) {
   className =  'text-sm font-medium font-poppins text-dark dark:text-white ' + (className || '')
  return (
    <>
<p className={className}>
        {children}
     </p>  

     </>
  );
}

Text.propTypes={
    className: PropTypes.string
}
export default Text;
