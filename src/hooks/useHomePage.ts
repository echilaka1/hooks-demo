import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchUsers } from "./useSearchUsers";

export const useHomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { users, isLoading, error } = useSearchUsers(searchQuery);
  const navigate = useNavigate();

  const handleSelectUser = (username: string) => {
    navigate(`/user/${username}`);
  };

  return {
    searchQuery,
    setSearchQuery,
    users,
    isLoading,
    error,
    handleSelectUser,
  };
};
