const Heading1 = ({tag, children, classname}) => {
    classname = classname || '';
  return (
    <>
    {tag && (<h1 className={classname + ' font-poppins font-light text-[64px] text-text-dark'}>{children}</h1>)}
    {!tag && (<div className={classname + ' font-poppins font-light text-[64px] text-text-dark'}>{children}</div>)}
    </>
  );
}

export default Heading1;
