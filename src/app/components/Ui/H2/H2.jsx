const H2 = ({tag, children, className}) => {
    className = 'font-poppins font-bold text-[24px] leading-[1.5] tracking-[0.02em] text-text-dark' + ( className || '');
  return (
    <>
    {tag && (<h2 className={className}>{children}</h2>)}
    {!tag && (<div className={className}>{children}</div>)}
    </>
  );
}

export default H2;
