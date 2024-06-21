const H3 = ({tag, children, className}) => {
    className = 'font-poppins font-semibold text-[18px] leading-[1.5] tracking-[0.02em] text-dark dark:text-white ' + ( className || '');
  return (
    <>
    {tag && (<h3 className={className}>{children}</h3>)}
    {!tag && (<div className={className}>{children}</div>)}
    </>
  );
}

export default H3;
