import type { User, UserSearchItem } from "../types/User";

interface UserCardProps {
  user: User | UserSearchItem;
  onClick: () => void;
}

export const UserCard = ({ user, onClick }: UserCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
    >
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {"name" in user && user.name ? user.name : user.login}
          </h3>
          <p className="text-sm text-gray-500 truncate">@{user.login}</p>
          {"followers" in user && user.followers !== undefined && (
            <p className="text-sm text-gray-600 mt-1">
              {user.followers} {user.followers === 1 ? "follower" : "followers"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
