import LazyLoad from 'react-lazyload';

export default function SmartLazyLoad({ isSSR, children, ...props }) {
  if (isSSR) {
    return children;
  }

  return <LazyLoad {...props}>{children}</LazyLoad>;
}
