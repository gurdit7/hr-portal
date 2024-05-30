import Wrapper from "../Wrapper/Wrapper";

const SkeletonLoader = ({className, children}) => {
  return (
<Wrapper className={className + ' w-full h-full animate-pulse bg-gray-200 dark:bg-gray-700'}>
{children}
</Wrapper>
  );
}

export default SkeletonLoader;
