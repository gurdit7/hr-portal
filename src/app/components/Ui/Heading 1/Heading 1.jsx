const Heading1 = ({tag, children, className}) => {
    className = className || '';
  return (
    <>
    {tag && (<h1 className={className + ' font-poppins font-light text-[64px] text-text-dark'}>{children}</h1>)}
    {!tag && (<div className={className + ' font-poppins font-light text-[64px] text-text-dark'}>{children}</div>)}
    </>
  );
}

export default Heading1;
