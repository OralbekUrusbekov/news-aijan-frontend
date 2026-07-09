'use client';

import { useEffect, useState } from 'react';
import { getHistory, HistoryEntry } from '@/lib/history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const refresh = () => setHistory(getHistory());
    refresh();
    window.addEventListener('news-history-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('news-history-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return history;
}
