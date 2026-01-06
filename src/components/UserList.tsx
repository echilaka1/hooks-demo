import type { UserSearchItem } from "../types/User";
import { UserCard } from "./UserCard";

interface UserListProps {
  users: UserSearchItem[];
  onSelectUser: (username: string) => void;
}

export const UserList = ({ users, onSelectUser }: UserListProps) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No users found. Try a different search query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onClick={() => onSelectUser(user.login)}
        />
      ))}
    </div>
  );
};
