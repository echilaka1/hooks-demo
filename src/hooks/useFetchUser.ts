import { useQuery } from "@tanstack/react-query";
import { githubApi } from "../services/githubApi";
import type { User } from "../types/User";

interface UseFetchUserReturn {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export const useFetchUser = (username: string): UseFetchUserReturn => {
  const { data, isLoading, error } = useQuery<User>({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await githubApi.get<User>(`/users/${username}`);
      return response.data;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: data || null,
    isLoading,
    error: error as Error | null,
  };
};
