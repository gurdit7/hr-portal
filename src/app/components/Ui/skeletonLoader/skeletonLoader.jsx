import Wrapper from "../Wrapper/Wrapper";

const SkeletonLoader = ({className, children}) => {
  return (
<Wrapper className={className + ' w-full animate-pulse bg-gray-200 dark:!bg-gray-600'}>
{children}
</Wrapper>
  );
}

export default SkeletonLoader;
