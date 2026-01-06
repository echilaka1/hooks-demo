import { useHomePage } from "../hooks/useHomePage";
import { SearchInput } from "../components/SearchInput";
import { UserList } from "../components/UserList";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

export const HomePage = () => {
  const {
    searchQuery,
    setSearchQuery,
    users,
    isLoading,
    error,
    handleSelectUser,
  } = useHomePage();

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Search GitHub Users
        </h2>
        <p className="text-gray-600">
          Enter a username or keyword to find GitHub users
        </p>
      </div>

      <SearchInput onSearch={setSearchQuery} />

      {isLoading && <LoadingSpinner />}

      {error && (
        <div className="mt-8">
          <ErrorMessage
            message={
              error.message || "Failed to search users. Please try again."
            }
          />
        </div>
      )}

      {!isLoading && !error && searchQuery.length > 2 && (
        <UserList users={users} onSelectUser={handleSelectUser} />
      )}

      {!isLoading &&
        !error &&
        searchQuery.length <= 2 &&
        searchQuery.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Please enter at least 3 characters to search.
            </p>
          </div>
        )}
    </div>
  );
};
