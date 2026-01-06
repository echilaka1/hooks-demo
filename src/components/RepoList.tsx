import type { Repo } from "../types/Repo";
import { RepoCard } from "./RepoCard";

interface RepoListProps {
  repos: Repo[];
  onSort: (criteria: "stars" | "name") => void;
}

export const RepoList = ({ repos, onSort }: RepoListProps) => {
  if (repos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No repositories found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Repositories</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="sort-select" className="text-sm text-gray-600">
            Sort by:
          </label>
          <select
            id="sort-select"
            onChange={(e) => onSort(e.target.value as "stars" | "name")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            defaultValue="stars"
          >
            <option value="stars">Stars</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};
