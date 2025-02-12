import { useLayoutEffect, useRef } from 'react';

function useAbortSignal(): AbortSignal {
  const ctrlRef = useRef<AbortController>(new AbortController());

  useLayoutEffect(() => {
    ctrlRef.current = new AbortController();
    return () => ctrlRef.current.abort();
  }, []);

  return ctrlRef.current.signal;
}

export default useAbortSignal;