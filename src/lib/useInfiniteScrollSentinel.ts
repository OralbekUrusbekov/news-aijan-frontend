'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useInfiniteScrollSentinel(onIntersect: () => void, enabled: boolean) {
  const callbackRef = useRef(onIntersect);
  callbackRef.current = onIntersect;

  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const ref = useCallback((el: HTMLDivElement | null) => setNode(el), []);

  useEffect(() => {
    if (!enabled || !node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callbackRef.current();
      },
      { rootMargin: '400px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, node]);

  return ref;
}
