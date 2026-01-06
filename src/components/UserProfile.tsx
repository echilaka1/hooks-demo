import type { User } from "../types/User";
import { formatDate } from "../utils/formatDate";
import {
  FaMapMarkerAlt,
  FaLink,
  FaBuilding,
  FaTwitter,
  FaUsers,
  FaUserPlus,
  FaFolder,
} from "react-icons/fa";

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
        <div className="flex-shrink-0 mb-6 md:mb-0">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="w-32 h-32 rounded-full border-4 border-gray-200"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user.name || user.login}
          </h1>
          <p className="text-xl text-gray-600 mb-4">@{user.login}</p>

          {user.bio && <p className="text-gray-700 mb-6">{user.bio}</p>}

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
            {user.location && (
              <div className="flex items-center space-x-1">
                <FaMapMarkerAlt />
                <span>{user.location}</span>
              </div>
            )}
            {user.blog && (
              <a
                href={user.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-blue-600"
              >
                <FaLink />
                <span>{user.blog}</span>
              </a>
            )}
            {user.company && (
              <div className="flex items-center space-x-1">
                <FaBuilding />
                <span>{user.company}</span>
              </div>
            )}
            {user.twitter_username && (
              <a
                href={`https://twitter.com/${user.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-blue-600"
              >
                <FaTwitter />
                <span>@{user.twitter_username}</span>
              </a>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-gray-600 mb-1">
                <FaUsers />
                <span className="text-sm">Followers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {user.followers}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-gray-600 mb-1">
                <FaUserPlus />
                <span className="text-sm">Following</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {user.following}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-gray-600 mb-1">
                <FaFolder />
                <span className="text-sm">Repos</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {user.public_repos}
              </p>
            </div>
          </div>

          {user.created_at && (
            <div className="text-sm text-gray-500">
              <p>Joined {formatDate(user.created_at)}</p>
            </div>
          )}

          <div className="mt-6">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
