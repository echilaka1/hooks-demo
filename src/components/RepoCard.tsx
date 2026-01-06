import type { Repo } from "../types/Repo";
import { FaStar, FaCodeBranch, FaExclamationCircle } from "react-icons/fa";

interface RepoCardProps {
  repo: Repo;
}

export const RepoCard = ({ repo }: RepoCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              {repo.name}
            </a>
          </h3>
          {repo.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {repo.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-4">
        {repo.language && (
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>{repo.language}</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <FaStar />
          <span>{repo.stargazers_count}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaCodeBranch />
          <span>{repo.forks_count}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaExclamationCircle />
          <span>{repo.open_issues_count}</span>
        </div>
      </div>
    </div>
  );
};
