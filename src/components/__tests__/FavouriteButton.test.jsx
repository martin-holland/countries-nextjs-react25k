import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import favouritesReducer from "../../lib/features/favourites/favouritesSlice";
import FavouriteButton from "../FavouriteButton";

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

// Mock Supabase
vi.mock("../../lib/supabase/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: mockAuthContext.session },
        error: null,
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 1, country_name: "Test Country" },
            error: null,
          }),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }),
    }),
  },
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

// Test wrapper component
const TestWrapper = ({ children, store }) => (
  <Provider store={store}>{children}</Provider>
);

describe("FavouriteButton Component", () => {
  const mockCountry = {
    name: { common: "Test Country" },
    flags: { svg: "test-flag.svg" },
    population: 1000000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders favorite button when user is authenticated", () => {
    const store = createTestStore();
    const { container } = render(
      <TestWrapper store={store}>
        <FavouriteButton country={mockCountry} />
      </TestWrapper>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTestId("FavoriteBorderIcon")).toBeInTheDocument();
  });

  it("shows filled heart when country is favorited", () => {
    const store = createTestStore({
      favourites: {
        favourites: [{ country_name: "Test Country" }],
        loading: false,
      },
    });

    render(
      <TestWrapper store={store}>
        <FavouriteButton country={mockCountry} />
      </TestWrapper>
    );

    expect(screen.getByTestId("FavoriteIcon")).toBeInTheDocument();
  });

  it("shows empty heart when country is not favorited", () => {
    const store = createTestStore({
      favourites: {
        favourites: [],
        loading: false,
      },
    });

    render(
      <TestWrapper store={store}>
        <FavouriteButton country={mockCountry} />
      </TestWrapper>
    );

    expect(screen.getByTestId("FavoriteBorderIcon")).toBeInTheDocument();
  });

  it("disables button when loading", () => {
    const store = createTestStore({
      favourites: {
        favourites: [],
        loading: true,
      },
    });

    render(
      <TestWrapper store={store}>
        <FavouriteButton country={mockCountry} />
      </TestWrapper>
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows correct tooltip text for unfavorited country", () => {
    const store = createTestStore({
      favourites: {
        favourites: [],
        loading: false,
      },
    });

    render(
      <TestWrapper store={store}>
        <FavouriteButton country={mockCountry} />
      </TestWrapper>
    );

    // Check for aria-label instead of text content since tooltip text is not rendered
    expect(screen.getByLabelText("Add to favourites")).toBeInTheDocument();
  });

  it("shows correct tooltip text for favorited country", () => {
    const store = createTestStore({
      favourites: {
        favourites: [{ country_name: "Test Country" }],
        loading: false,
      },
    });

    render(
      <TestWrapper store={store}>
        <FavouriteButton country={mockCountry} />
      </TestWrapper>
    );

    // Check for aria-label instead of text content since tooltip text is not rendered
    expect(screen.getByLabelText("Remove from favourites")).toBeInTheDocument();
  });
});
