import PropTypes from 'prop-types';
function Text({children , className}) {
   className =  'text-sm font-medium font-poppins text-text-dark ' + (className || '')
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
