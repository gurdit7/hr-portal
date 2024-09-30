const Heading1 = ({tag, children, className}) => {
    className = 'font-poppins font-light 2xl:text-[64px] xl:text-[48px] text-5xl  text-dark dark:text-white ' +  className || '';
  return (
    <>
    {tag && (<h1 className={className}>{children}</h1>)}
    {!tag && (<div className={className}>{children}</div>)}
    </>
  );
}

export default Heading1;
