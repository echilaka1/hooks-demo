import { useParams } from "react-router-dom";
import { useFetchRepos } from "../hooks/useFetchRepos";
import { RepoList } from "../components/RepoList";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

export const ReposPage = () => {
  const { username } = useParams<{ username: string }>();
  const { sortedRepos, isLoading, error, sortBy } = useFetchRepos(
    username || ""
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={
          error.message || "Failed to load repositories. Please try again."
        }
      />
    );
  }

  return <RepoList repos={sortedRepos} onSort={sortBy} />;
};
