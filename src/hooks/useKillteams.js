import { useEffect, useState } from 'react';
import { getKillteams } from '../services/ObjectDataService';

/**
 * Hook to load all killteams for the top page, with faction attached.
 * @returns {{killteams: import('../types/Types').OrganizedKillteam[], loading: boolean, error: string|null}}
 */
export function useKillteams() {
  const [killteams, setKillteams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getKillteams();
        if (!cancelled) setKillteams(list);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { killteams, loading, error };
}
