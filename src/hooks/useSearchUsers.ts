import { useQuery } from "@tanstack/react-query";
import { githubApi } from "../services/githubApi";
import type { UserSearchResult, UserSearchItem } from "../types/User";

interface UseSearchUsersReturn {
  users: UserSearchItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useSearchUsers = (query: string): UseSearchUsersReturn => {
  const { data, isLoading, error, refetch } = useQuery<UserSearchItem[]>({
    queryKey: ["users", query],
    queryFn: async () => {
      const response = await githubApi.get<UserSearchResult>(
        `/search/users?q=${encodeURIComponent(query)}`
      );
      // Sort by score descending (GitHub's relevance score)
      const sortedUsers = response.data.items.sort((a, b) => b.score - a.score);
      return sortedUsers;
    },
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    users: data || [],
    isLoading,
    error: error as Error | null,
    refetch: () => {
      refetch();
    },
  };
};
