# GitHub User Explorer

A modern React application that demonstrates clean architecture principles with complete separation of concerns. The app allows users to search for GitHub users, view detailed profiles, and browse repositories using GitHub's public API.

## 🎯 Project Overview

This application showcases best practices in React development:
- **Pure Presentation Layer**: UI components are stateless and only handle rendering
- **Logic Layer**: All business logic, state management, and data fetching live in custom hooks
- **React Query Integration**: Efficient data fetching, caching, and state management
- **Type Safety**: Full TypeScript implementation

## ✨ Features

- **User Search**: Search GitHub users by username or keyword (minimum 3 characters)
- **User Profiles**: View detailed user information including:
  - Avatar, name, bio
  - Followers, following, and repository counts
  - Location, company, blog, Twitter
  - Join date
- **Repository Browsing**: View and sort user repositories by:
  - Stars (default)
  - Name (alphabetical)
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Loading States**: Spinner indicators during data fetching
- **Error Handling**: User-friendly error messages
- **Caching**: React Query automatically caches API responses for 5 minutes

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **TanStack React Query v5** - Data fetching and caching
- **Axios** - HTTP client
- **Tailwind CSS v3** - Utility-first CSS framework
- **React Icons** - Icon library
- **date-fns** - Date formatting

## 📁 Folder Structure

```
hooks-demo/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons
│   ├── components/         # Presentation layer (pure UI components)
│   │   ├── ErrorMessage.tsx
│   │   ├── Layout.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── RepoCard.tsx
│   │   ├── RepoList.tsx
│   │   ├── SearchInput.tsx
│   │   ├── UserCard.tsx
│   │   ├── UserList.tsx
│   │   └── UserProfile.tsx
│   ├── hooks/              # Logic layer (custom React Query hooks)
│   │   ├── useFetchRepos.ts
│   │   ├── useFetchUser.ts
│   │   ├── useHomePage.ts
│   │   └── useSearchUsers.ts
│   ├── pages/              # Page-level compositions
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── ReposPage.tsx
│   ├── services/           # API utilities
│   │   └── githubApi.ts
│   ├── types/              # TypeScript interfaces
│   │   ├── Repo.ts
│   │   └── User.ts
│   ├── utils/              # Helper functions
│   │   └── formatDate.ts
│   ├── App.tsx             # Root component with routing
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles (Tailwind imports)
│   └── constants.ts        # App constants
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🏗️ Architecture

### Separation of Concerns

The application follows a strict separation between presentation and logic:

#### **Presentation Layer** (`components/`)
- Pure functional components
- Receive props and render JSX
- No state management
- No side effects
- No data fetching

Example:
```tsx
// Pure presentation component
export const UserCard = ({ user, onClick }: UserCardProps) => {
  return <div onClick={onClick}>...</div>;
};
```

#### **Logic Layer** (`hooks/`)
- Custom hooks using React Query
- Handle all state management
- Perform data fetching
- Transform and sort data
- Return data, loading states, errors, and handlers

Example:
```tsx
// Logic hook
export const useSearchUsers = (query: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', query],
    queryFn: () => fetchUsers(query),
  });
  return { users: data, isLoading, error };
};
```

#### **Page Components** (`pages/`)
- Compose hooks and UI components
- Handle routing logic
- Pass data and handlers to presentation components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The terminal will display a local URL (typically `http://localhost:5173`)
   - Open that URL in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📖 Usage

### Searching for Users

1. On the home page, type at least 3 characters in the search box
2. Results appear automatically (with 500ms debounce)
3. Click on any user card to view their profile

### Viewing User Profile

- See detailed user information
- Click "Repositories" tab to view their repos
- Use the sort dropdown to sort repositories by stars or name

### Navigation

- Click the header logo to return home
- Use browser back button for navigation
- Direct URL access: `/user/{username}` or `/user/{username}/repos`

## 🔑 Key Concepts

### React Query Hooks

The app uses three main data-fetching hooks:

1. **`useSearchUsers(query)`** - Searches GitHub users
   - Query key: `['users', query]`
   - Enabled only when query length > 2
   - Sorts results by relevance score

2. **`useFetchUser(username)`** - Fetches single user profile
   - Query key: `['user', username]`
   - Caches for 5 minutes

3. **`useFetchRepos(username)`** - Fetches user repositories
   - Query key: `['repos', username]`
   - Includes sorting logic (stars/name)

### API Integration

- **Base URL**: `https://api.github.com`
- **Endpoints Used**:
  - `GET /search/users?q={query}` - Search users
  - `GET /users/{username}` - Get user profile
  - `GET /users/{username}/repos` - Get user repositories
- **Rate Limiting**: GitHub API has rate limits (60 requests/hour for unauthenticated requests)

### Routing

- `/` - Home page (search)
- `/user/:username` - User profile page
- `/user/:username/repos` - User repositories (nested route)
- `*` - 404 page

## 🎨 Styling

The app uses **Tailwind CSS** for styling:
- Utility-first approach
- Responsive design with breakpoints
- Consistent color scheme and spacing
- Custom components styled with Tailwind classes

## 🧪 Development

### React Query Devtools

In development mode, React Query Devtools are available:
- Look for the React Query logo in the bottom-left corner
- Click to open the devtools panel
- Inspect queries, cache, and refetch status

### Type Safety

All components and hooks are fully typed:
- User and Repo interfaces match GitHub API responses
- Props are strictly typed
- Hooks return typed values

## 📝 Code Quality

- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Functional Components** - No class components
- **Custom Hooks** - Reusable logic
- **Separation of Concerns** - Clear layer boundaries

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- GitHub API for providing public access
- TanStack for React Query
- Vite team for the excellent build tool

---

**Built with ❤️ to demonstrate React best practices**
