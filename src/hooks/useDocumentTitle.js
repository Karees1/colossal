import { useEffect } from 'react';

// Sets the browser tab title per page; restores the default on unmount so a
// route change away doesn't leave a stale title behind.
export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · GENTLEMAN` : 'GENTLEMAN';
    return () => { document.title = previous; };
  }, [title]);
}
