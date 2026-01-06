# Clean React Architecture: Separating Logic from Presentation with Custom Hooks and React Query

## Introduction

In many React applications, developers fall into a common trap: they cram data fetching, state management, and business logic directly into components. You've probably seen code like this:

```tsx
function UserProfile({ username }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${username}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
      {/* More JSX... */}
    </div>
  );
}
```

This approach leads to **bloated, hard-to-test components** that mix concerns. The component is responsible for:
- Data fetching
- State management
- Error handling
- Loading states
- Rendering UI

In this article, we'll explore a better approach: **extracting all logic into reusable custom hooks powered by React Query**, keeping UI components pure and focused solely on rendering. We'll build a GitHub User Explorer app to demonstrate these principles.

## The Problem: Mixed Concerns

When logic lives inside components, you face several issues:

1. **Hard to Test**: You can't test data fetching logic without rendering the component
2. **Poor Reusability**: Logic is tied to specific UI components
3. **Difficult to Maintain**: Business logic, state, and presentation are all intertwined
4. **No Caching**: Each component instance fetches data independently
5. **Complex State Management**: Manual loading/error states scattered throughout components

## The Solution: Custom Hooks + React Query

Instead, we'll extract all logic into custom hooks that use React Query. This gives us:

- ✅ **Separation of Concerns**: Logic separate from presentation
- ✅ **Automatic Caching**: React Query handles caching intelligently
- ✅ **Easy Testing**: Test hooks independently
- ✅ **Reusability**: Use the same hook in multiple components
- ✅ **Better DX**: Less boilerplate, more features out of the box

## Building the GitHub User Explorer

Let's build a real application that demonstrates these principles. Our app will:
- Search for GitHub users
- Display user profiles
- Show user repositories with sorting

### Architecture Overview

Our application follows a strict separation:

```
┌─────────────────────────────────────┐
│   Presentation Layer (Components)   │
│   - Pure functions                  │
│   - Receive props, render JSX       │
│   - No state, no side effects       │
└─────────────────────────────────────┘
              ▲
              │ props (data, handlers)
              │
┌─────────────────────────────────────┐
│   Logic Layer (Custom Hooks)        │
│   - React Query hooks               │
│   - State management                │
│   - Data fetching & transformation  │
│   - Business logic                   │
└─────────────────────────────────────┘
```

## Step 1: Creating Pure Presentation Components

Let's start with a simple user card component. Notice how it's **completely pure** - it receives props and renders:

```tsx
// src/components/UserCard.tsx
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
        </div>
      </div>
    </div>
  );
};
```

**Key Points:**
- No `useState`, no `useEffect`, no data fetching
- Just receives `user` and `onClick` as props
- Easy to test: pass props, check rendered output
- Easy to reuse: use it anywhere you need to display a user

## Step 2: Extracting Logic into Custom Hooks

Now let's create a hook that handles the search logic. This is where React Query shines:

```tsx
// src/hooks/useSearchUsers.ts
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "../services/githubApi";
import type { UserSearchResult, UserSearchItem } from "../types/User";

interface UseSearchUsersReturn {
  users: UserSearchItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useSearchUsers = (query: string): UseSearchUsersReturn => {
  const { data, isLoading, error, refetch } = useQuery<UserSearchItem[]>({
    queryKey: ["users", query],
    queryFn: async () => {
      const response = await githubApi.get<UserSearchResult>(
        `/search/users?q=${encodeURIComponent(query)}`
      );
      // Business logic: sort by relevance score
      const sortedUsers = response.data.items.sort((a, b) => b.score - a.score);
      return sortedUsers;
    },
    enabled: query.length > 2, // Only fetch if query is long enough
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    users: data || [],
    isLoading,
    error: error as Error | null,
    refetch: () => {
      refetch();
    },
  };
};
```

**What's happening here:**
- **Query Key**: `["users", query]` - React Query uses this for caching
- **Query Function**: The actual API call
- **Business Logic**: Sorting happens here, not in the component
- **Automatic Features**: Caching, refetching, error handling - all handled by React Query
- **Conditional Fetching**: `enabled` option prevents unnecessary API calls

## Step 3: Composing Hooks for Page Logic

For the home page, we need to combine search logic with navigation. Let's create a page-specific hook:

```tsx
// src/hooks/useHomePage.ts
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
```

**Benefits:**
- All state management in one place
- Navigation logic separated from UI
- Easy to test: mock `useNavigate`, test the hook
- Reusable: could use this hook in a different component if needed

## Step 4: Pure Page Components

Now our page component is **incredibly simple** - it just composes the hook and renders:

```tsx
// src/pages/HomePage.tsx
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
    </div>
  );
};
```

**Compare this to the traditional approach:**
- ❌ **Before**: 50+ lines mixing state, effects, and JSX
- ✅ **Now**: Clean, declarative, easy to read
- ✅ **Testable**: Test the hook separately, test the component separately
- ✅ **Maintainable**: Change logic? Update the hook. Change UI? Update the component.

## Advanced Example: Repository Fetching with Sorting

Let's look at a more complex example - fetching and sorting repositories:

```tsx
// src/hooks/useFetchRepos.ts
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "../services/githubApi";
import type { Repo } from "../types/Repo";

type SortCriteria = "stars" | "name";

interface UseFetchReposReturn {
  repos: Repo[];
  sortedRepos: Repo[];
  isLoading: boolean;
  error: Error | null;
  sortBy: (criteria: SortCriteria) => void;
}

export const useFetchRepos = (username: string): UseFetchReposReturn => {
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>("stars");

  const { data, isLoading, error } = useQuery<Repo[]>({
    queryKey: ["repos", username],
    queryFn: async () => {
      const response = await githubApi.get<Repo[]>(`/users/${username}/repos`);
      return response.data;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });

  // Business logic: sorting happens in the hook
  const sortedRepos = data
    ? [...data].sort((a, b) => {
        if (sortCriteria === "stars") {
          return b.stargazers_count - a.stargazers_count;
        } else {
          return a.name.localeCompare(b.name);
        }
      })
    : [];

  return {
    repos: data || [],
    sortedRepos,
    isLoading,
    error: error as Error | null,
    sortBy: (criteria: SortCriteria) => {
      setSortCriteria(criteria);
    },
  };
};
```

**Key Points:**
- Sorting logic lives in the hook, not the component
- The component just calls `sortBy("stars")` or `sortBy("name")`
- Easy to add more sorting options: just update the hook
- The UI component remains simple:

```tsx
// src/components/RepoList.tsx
export const RepoList = ({ repos, onSort }: RepoListProps) => {
  return (
    <div>
      <select onChange={(e) => onSort(e.target.value as "stars" | "name")}>
        <option value="stars">Stars</option>
        <option value="name">Name</option>
      </select>
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
};
```

## Benefits in Practice

### 1. **Testability**

Testing a hook is straightforward:

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchUsers } from './useSearchUsers';

test('useSearchUsers returns sorted users', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useSearchUsers('react'), { wrapper });

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  
  expect(result.current.users).toBeSortedBy('score', { descending: true });
});
```

Testing the component is equally simple - just pass props:

```tsx
test('UserCard renders user information', () => {
  const user = { login: 'octocat', avatar_url: '...' };
  render(<UserCard user={user} onClick={jest.fn()} />);
  
  expect(screen.getByText('octocat')).toBeInTheDocument();
});
```

### 2. **Reusability**

The same hook can be used in multiple places:

```tsx
// In a search page
const { users } = useSearchUsers(query);

// In a sidebar widget
const { users: trendingUsers } = useSearchUsers('stars:>1000');

// In a modal
const { users: suggestedUsers } = useSearchUsers('language:javascript');
```

### 3. **Automatic Caching**

React Query automatically caches responses. If you search for "react" twice:
- First time: API call
- Second time: Instant response from cache (if within 5 minutes)

No manual cache management needed!

### 4. **Better Developer Experience**

React Query Devtools show you:
- All active queries
- Cache status
- Refetch status
- Error states

All without writing any debugging code.

## Common Patterns

### Pattern 1: Conditional Fetching

```tsx
const { data } = useQuery({
  queryKey: ['user', username],
  queryFn: () => fetchUser(username),
  enabled: !!username, // Only fetch if username exists
});
```

### Pattern 2: Dependent Queries

```tsx
const { data: user } = useQuery({
  queryKey: ['user', username],
  queryFn: () => fetchUser(username),
});

const { data: repos } = useQuery({
  queryKey: ['repos', username],
  queryFn: () => fetchRepos(username),
  enabled: !!user, // Only fetch repos after user is loaded
});
```

### Pattern 3: Optimistic Updates

```tsx
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUser) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['user', id] });
    
    // Snapshot previous value
    const previousUser = queryClient.getQueryData(['user', id]);
    
    // Optimistically update
    queryClient.setQueryData(['user', id], newUser);
    
    return { previousUser };
  },
  onError: (err, newUser, context) => {
    // Rollback on error
    queryClient.setQueryData(['user', id], context.previousUser);
  },
});
```

## Migration Strategy

If you have existing components with mixed concerns, here's how to migrate:

### Step 1: Identify Logic
Find all `useState`, `useEffect`, and data fetching in your component.

### Step 2: Extract to Hook
Move that logic into a custom hook:

```tsx
// Before: Logic in component
function UserProfile({ id }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);
  // ...
}

// After: Logic in hook
function useUser(id) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
  });
}

function UserProfile({ id }) {
  const { data: user } = useUser(id);
  // ...
}
```

### Step 3: Simplify Component
Remove all logic, keep only rendering.

## Conclusion

By separating logic from presentation:

1. **Components become pure** - Easy to read, test, and maintain
2. **Hooks become reusable** - Use the same logic in multiple places
3. **Testing becomes easier** - Test logic and UI separately
4. **Caching is automatic** - React Query handles it for you
5. **Code is more maintainable** - Clear boundaries between concerns

The GitHub User Explorer app demonstrates these principles in practice. Every component is pure, every hook is focused, and the codebase is clean and maintainable.

### Key Takeaways

- ❌ **Don't**: Mix data fetching, state, and UI in components
- ✅ **Do**: Extract logic into custom hooks powered by React Query
- ✅ **Do**: Keep components pure - props in, JSX out
- ✅ **Do**: Compose hooks for page-level logic
- ✅ **Do**: Test hooks and components separately

Start applying these patterns in your next React project, and you'll see immediate improvements in code quality, testability, and developer experience.

---

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [GitHub User Explorer Source Code](https://github.com/yourusername/github-user-explorer)

## Full Code Example

You can explore the complete implementation in the [GitHub User Explorer repository](https://github.com/yourusername/github-user-explorer). The codebase demonstrates:

- Custom hooks for data fetching (`useSearchUsers`, `useFetchUser`, `useFetchRepos`)
- Page-level composition hooks (`useHomePage`)
- Pure presentation components
- React Router integration
- TypeScript throughout
- Tailwind CSS for styling

Happy coding! 🚀

