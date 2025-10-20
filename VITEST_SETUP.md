# Vitest + React Testing Library Setup for Next.js

This guide covers setting up Vitest with React Testing Library for testing React components in your Next.js project.

## Required Dependencies

Install the minimal required dependencies:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### What each dependency does:

- `vitest` - The testing framework (Jest-compatible API)
- `@testing-library/react` - Core React testing utilities
- `@testing-library/jest-dom` - Additional DOM matchers (like `toBeInTheDocument()`)
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM environment for Node.js testing

## Configuration Steps

### 1. Create Vitest Configuration

Create `vitest.config.js` in your project root:

```javascript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./test/setup.js",
    globals: true,
  },
});
```

### 2. Create Test Setup File

Create `test/setup.js` in your project root:

```javascript
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Automatically unmount and cleanup DOM after each test
afterEach(() => {
  cleanup();
});
```

### 3. Update package.json Scripts

Add test scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  }
}
```

## Writing Your First Test

Create a test file (e.g., `components/Button.test.jsx`):

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Running Tests

- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI (requires `@vitest/ui` package)

## Comprehensive Testing Examples

### 1. API Route Testing

Create `src/app/api/test/__tests__/route.test.js`:

```javascript
import { describe, it, expect } from "vitest";

const createMockRequest = () => ({
  url: "http://localhost:3000/api/test",
  method: "GET",
  headers: new Headers(),
});

describe("API Route: /api/test", () => {
  it("should return a successful response", async () => {
    const { GET } = await import("../route.js");
    const mockRequest = createMockRequest();
    const response = await GET(mockRequest);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
  });
});
```

### 2. Component Testing with Redux

Create `src/components/__tests__/FavouriteButton.test.jsx`:

```javascript
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import FavouriteButton from "../FavouriteButton";
import favouritesReducer from "../../lib/features/favourites/favouritesSlice";

// Mock the AuthContext
const mockAuthContext = {
  user: { id: "test-user-id", email: "test@example.com" },
  session: { access_token: "mock-token" },
  loading: false,
  signOut: vi.fn(),
};

vi.mock("../../app/context/AuthContext", () => ({
  useAuth: () => mockAuthContext,
}));

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      favourites: favouritesReducer,
    },
    preloadedState: {
      favourites: {
        favourites: [],
        loading: false,
        ...initialState.favourites,
      },
    },
  });
};

const TestWrapper = ({ children, store }) => (
  <Provider store={store}>{children}</Provider>
);

describe("FavouriteButton Component", () => {
  const mockCountry = {
    name: { common: "Test Country" },
    flags: { svg: "test-flag.svg" },
    population: 1000000,
  };

  it("renders favorite button when user is authenticated", () => {
    const store = createTestStore();
    render(
      <TestWrapper store={store}>
        <FavouriteButton country={mockCountry} />
      </TestWrapper>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
```

### 3. Redux Slice Testing

Create `src/lib/features/favourites/__tests__/favouritesSlice.test.js`:

```javascript
import { describe, it, expect, vi, beforeEach } from "vitest";
import favouritesReducer, {
  fetchFavourites,
  addFavourite,
  removeFavourite,
} from "../favouritesSlice";

// Mock Supabase
const mockSupabase = {
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: { session: { access_token: "mock-token" } },
      error: null,
    }),
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({
        data: [{ id: 1, country_name: "Test Country" }],
        error: null,
      }),
    }),
  }),
};

vi.mock("../../supabase/supabase", () => ({
  supabase: mockSupabase,
}));

describe("favouritesSlice", () => {
  const initialState = {
    favourites: [],
    loading: false,
  };

  it("should handle fetchFavourites.fulfilled", () => {
    const mockFavourites = [{ id: 1, country_name: "Test Country" }];
    const action = {
      type: fetchFavourites.fulfilled.type,
      payload: mockFavourites,
    };

    const state = favouritesReducer(initialState, action);
    expect(state.favourites).toEqual(mockFavourites);
    expect(state.loading).toBe(false);
  });
});
```

### 4. Context Testing

Create `src/app/context/__tests__/AuthContext.test.jsx`:

```javascript
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";

// Mock Supabase
const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signOut: vi.fn(),
  },
};

vi.mock("../../lib/supabase/supabase", () => ({
  supabase: mockSupabase,
}));

const TestComponent = () => {
  const { user, session, loading } = useAuth();

  return (
    <div>
      <div data-testid="user">{user ? user.email : "No user"}</div>
      <div data-testid="session">{session ? "Has session" : "No session"}</div>
      <div data-testid="loading">{loading ? "Loading" : "Not loading"}</div>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should provide initial loading state", () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("Loading");
  });
});
```

## Additional Notes

- Vitest provides Jest-compatible APIs, so most Jest documentation applies
- Use `vi.fn()` instead of `jest.fn()` for mocking
- Import `vi` from 'vitest' for test utilities
- Tests should be placed in `__tests__` folders or files ending with `.test.js` or `.test.jsx`
- Always import React in test files when using JSX
- Mock external dependencies like Supabase, APIs, and contexts
- Use `act()` for testing async operations in React components
