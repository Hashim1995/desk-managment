import { useEffect, useState } from 'react';

function useResizeObserver(ref: any) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      });
    });

    if (observeTarget) {
      resizeObserver.observe(observeTarget);
    }

    return () => {
      if (observeTarget) {
        resizeObserver.unobserve(observeTarget);
      }
    };
  }, [ref]);

  return size;
}

export default useResizeObserver;
