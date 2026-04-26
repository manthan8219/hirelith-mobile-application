import { useState, useEffect, useCallback } from 'react';
import { fetchStarredList, fetchStarredRepos, starRepo, unstarRepo, GithubTrendingRepoDto } from '../services/api';

interface State {
  starredIds: Set<string>;
  repos: GithubTrendingRepoDto[];
  loading: boolean;
  error: string | null;
}

export function useStarredRepos(firebaseUid: string | null | undefined) {
  const [state, setState] = useState<State>({
    starredIds: new Set(),
    repos: [],
    loading: false,
    error: null,
  });

  const loadStarredList = useCallback(async () => {
    if (!firebaseUid) return;
    try {
      const list = await fetchStarredList(firebaseUid);
      setState(prev => ({ ...prev, starredIds: new Set(list) }));
    } catch {
      // non-critical
    }
  }, [firebaseUid]);

  const loadStarredRepos = useCallback(async () => {
    if (!firebaseUid) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const repos = await fetchStarredRepos(firebaseUid);
      setState(prev => ({ ...prev, repos, loading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message ?? 'Failed to load starred repos' }));
    }
  }, [firebaseUid]);

  useEffect(() => {
    loadStarredList();
  }, [loadStarredList]);

  const toggleStar = useCallback(async (repo: GithubTrendingRepoDto) => {
    if (!firebaseUid) return;
    const isCurrentlyStarred = state.starredIds.has(repo.fullName);

    // Optimistic update
    setState(prev => {
      const next = new Set(prev.starredIds);
      if (isCurrentlyStarred) {
        next.delete(repo.fullName);
      } else {
        next.add(repo.fullName);
      }
      return { ...prev, starredIds: next };
    });

    try {
      if (isCurrentlyStarred) {
        await unstarRepo(firebaseUid, repo.fullName);
      } else {
        await starRepo(firebaseUid, repo.fullName);
      }
    } catch {
      // Revert on failure
      setState(prev => {
        const next = new Set(prev.starredIds);
        if (isCurrentlyStarred) {
          next.add(repo.fullName);
        } else {
          next.delete(repo.fullName);
        }
        return { ...prev, starredIds: next };
      });
    }
  }, [firebaseUid, state.starredIds]);

  return { ...state, toggleStar, loadStarredRepos, refresh: loadStarredList };
}
