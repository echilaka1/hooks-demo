export interface User {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string | null;
  bio?: string | null;
  public_repos?: number;
  followers?: number;
  following?: number;
  created_at?: string;
  location?: string | null;
  blog?: string | null;
  company?: string | null;
  twitter_username?: string | null;
}

export interface UserSearchItem {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
  score: number;
}

export interface UserSearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: UserSearchItem[];
}

