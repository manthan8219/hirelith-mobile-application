import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchGithubTrending,
  fetchGithubTrendingDates,
  GithubTrendingRepoDto,
  GithubTrendingMeta,
} from '../services/api';

type Since = 'daily' | 'weekly' | 'monthly';

interface State {
  repos: GithubTrendingRepoDto[];
  meta: GithubTrendingMeta | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  availableDates: string[];
  activeDate: string | null;
}

const LIMIT = 20;

export function useGithubTrending(since: Since) {
  const [state, setState] = useState<State>({
    repos: [],
    meta: null,
    loading: true,
    loadingMore: false,
    error: null,
    availableDates: [],
    activeDate: null,
  });

  const pageRef = useRef(1);
  const sinceRef = useRef(since);
  const dateRef = useRef<string | null>(null);

  const load = useCallback(async (s: Since, page: number, append: boolean, date?: string | null) => {
    try {
      if (page === 1) setState(prev => ({ ...prev, loading: true, error: null }));
      else setState(prev => ({ ...prev, loadingMore: true }));

      const [res, dates] = await Promise.all([
        fetchGithubTrending(s, page, LIMIT, undefined, date ?? undefined),
        page === 1 ? fetchGithubTrendingDates(s) : Promise.resolve(null),
      ]);

      setState(prev => ({
        repos: append ? [...prev.repos, ...res.data] : res.data,
        meta: res.meta,
        loading: false,
        loadingMore: false,
        error: null,
        availableDates: dates ?? prev.availableDates,
        // on first load with no explicit date, activeDate = whatever the API defaulted to (latest)
        activeDate: date !== undefined ? (date ?? null) : (dates?.[0] ?? prev.activeDate),
      }));
      pageRef.current = page;
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, loadingMore: false, error: err.message ?? 'Failed to load' }));
    }
  }, []);

  useEffect(() => {
    sinceRef.current = since;
    dateRef.current = null;
    pageRef.current = 1;
    load(since, 1, false, null);
  }, [since, load]);

  const selectDate = useCallback((date: string) => {
    dateRef.current = date;
    pageRef.current = 1;
    setState(prev => ({ ...prev, activeDate: date }));
    load(sinceRef.current, 1, false, date);
  }, [load]);

  const refresh = useCallback(() => {
    pageRef.current = 1;
    load(sinceRef.current, 1, false, dateRef.current);
  }, [load]);

  const loadMore = useCallback(() => {
    if (state.loadingMore || state.loading) return;
    if (!state.meta?.hasNextPage) return;
    const next = pageRef.current + 1;
    load(sinceRef.current, next, true, dateRef.current);
  }, [state.loadingMore, state.loading, state.meta, load]);

  return { ...state, refresh, loadMore, selectDate };
}
