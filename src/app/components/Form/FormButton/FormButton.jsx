import PropTypes from 'prop-types';

const FormButton = ({ children, type, btnType, label, loading, loadingText, event, additionalCss}) => {
    let classes = `${additionalCss || ''}   ${loading ? ' opacity-50' : '' }`;
    btnType === 'solid' ? classes += ' bg-accent w-full overflow-hidden relative rounded-lg text-base font-poppins font-medium py-[15px] text-white before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-blue-500 before:transition-all before:duration-500 hover:text-white hover:shadow-blue-500 hover:before:left-0 hover:before:w-full' : '';
    btnType === 'outlined' ? classes += ' before:absolute before:bottom-0 overflow-hidden relative before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-accent before:transition-all before:duration-500 hover:text-white hover:shadow-accent hover:before:left-0 hover:before:w-full border border-accent w-full text-accent px-12  rounded-lg text-base font-poppins font-medium py-[10px]' : '';
    btnType === 'link' ? classes += ' text-accent text-sm font-poppins font-medium' : '';
    btnType === 'button' ? classes += classes : '';
    return (
        <>
        {event && (<button type={type} className={classes + ' '} onClick={event}>
            <span className="relative z-10 flex gap-1 justify-center items-center flex-row-reverse w-full">{children} {loading ? loadingText : label}</span> 
            </button>) }

            {!event && (<button type={type} className={classes} onClick={event}>
                <span className="relative z-10 flex gap-1 justify-center items-center">{children} {loading ? loadingText : label}</span> 
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