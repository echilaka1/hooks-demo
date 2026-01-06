import { useParams, Link, NavLink, Outlet } from "react-router-dom";
import { useFetchUser } from "../hooks/useFetchUser";
import { UserProfile } from "../components/UserProfile";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user, isLoading, error } = useFetchUser(username || "");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div>
        <ErrorMessage
          message={error.message || "Failed to load user. User may not exist."}
        />
        <div className="mt-4">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to search
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <ErrorMessage message="User not found" />
        <div className="mt-4">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to search
        </Link>
      </div>
      <UserProfile user={user} />
      <div className="mt-8">
        <nav className="border-b border-gray-200 mb-6">
          <NavLink
            to={`/user/${username}/repos`}
            className={({ isActive }) =>
              `inline-block px-4 py-2 font-semibold transition-colors ${
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            Repositories ({user.public_repos})
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </div>
  );
};
