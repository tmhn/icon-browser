import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver({
  threshold = 0,
  rootMargin = '0px',
  freezeOnceVisible = false,
}: UseIntersectionObserverProps = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [node, setNode] = useState<Element | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, rootMargin };
    const currentObserver = new IntersectionObserver(updateEntry, observerParams);

    observer.current = currentObserver;
    currentObserver.observe(node);

    return () => currentObserver.disconnect();
  }, [node, threshold, rootMargin, frozen]);

  const prevNode = useRef<Element | null>(null);

  useEffect(() => {
    if (prevNode.current === node) return;

    prevNode.current = node;
    setNode(node);
  }, [node]);

  return [setNode, entry] as const;
}
