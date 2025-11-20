import { useEffect, useState } from 'react';
import { getKillteamDetails } from '../services/ObjectDataService';

/**
 * Hook to load a single killteam details including faction, optypes (with abilities, options, weapons+profiles+rules), equipments, and ploys (separate section).
 * @param {string|null|undefined} killteamId
 * @returns {{killteam: import('../types/Types').OrganizedKillteam|null, loading: boolean, error: string|null}}
 */
export function useKillteamDetails(killteamId) {
  const [killteam, setKillteam] = useState(null);
  const [loading, setLoading] = useState(!!killteamId);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!killteamId) {
      setKillteam(null);
      setLoading(false);
      setError(null);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getKillteamDetails(killteamId);
        if (!cancelled) setKillteam(data || null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [killteamId]);

  return { killteam, loading, error };
}
