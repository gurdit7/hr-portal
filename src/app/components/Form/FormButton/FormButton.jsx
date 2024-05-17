import PropTypes from 'prop-types';
const FormButton = ({ children, type, btnType, label, loading, loadingText, event, additionalCss}) => {
    let classes = `${additionalCss || ''}   ${loading ? ' opacity-50' : '' }`;
    btnType === 'solid' ? classes += ' bg-accent w-full rounded-[60px] text-base font-poppins font-medium py-[15px] text-white hover:bg-dark-blue' : '';
    btnType === 'outlined' ? classes += ' hover:bg-accent hover:text-white border border-accent w-full text-accent px-12 rounded-[60px] text-base font-poppins font-medium py-[10px]' : '';
    btnType === 'link' ? classes += ' text-accent text-sm font-poppins font-medium' : '';
    btnType === 'button' ? classes += classes : '';
    return (
        <>
        {event && (<button type={type} className={classes + ' '} onClick={event}>
               {children} {loading ? loadingText : label}
            </button>) }

            {!event && (<button type={type} className={classes} onClick={event}>
                {children} {loading ? loadingText : label}
            </button>) }
            
        </>
    )
}
FormButton.propTypes = {
    type: PropTypes.string,
    btnType: PropTypes.string.isRequired,
    label: PropTypes.string,
    loading: PropTypes.bool,
    loadingText:PropTypes.string
};
export default FormButton;