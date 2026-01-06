import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "../services/githubApi";
import type { Repo } from "../types/Repo";

type SortCriteria = "stars" | "name";

interface UseFetchReposReturn {
  repos: Repo[];
  sortedRepos: Repo[];
  isLoading: boolean;
  error: Error | null;
  sortBy: (criteria: SortCriteria) => void;
}

export const useFetchRepos = (username: string): UseFetchReposReturn => {
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>("stars");

  const { data, isLoading, error } = useQuery<Repo[]>({
    queryKey: ["repos", username],
    queryFn: async () => {
      const response = await githubApi.get<Repo[]>(`/users/${username}/repos`);
      return response.data;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const sortedRepos = data
    ? [...data].sort((a, b) => {
        if (sortCriteria === "stars") {
          return b.stargazers_count - a.stargazers_count;
        } else {
          return a.name.localeCompare(b.name);
        }
      })
    : [];

  return {
    repos: data || [],
    sortedRepos,
    isLoading,
    error: error as Error | null,
    sortBy: (criteria: SortCriteria) => {
      setSortCriteria(criteria);
    },
  };
};
