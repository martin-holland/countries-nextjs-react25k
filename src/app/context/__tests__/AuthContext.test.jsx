import * as supabaseModule from "@/lib/supabase/supabase";
import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "../AuthContext";

// Mock Supabase
vi.mock("@/lib/supabase/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Test component that uses the context
const TestComponent = () => {
  const { user, session, loading, signOut } = useAuth();

  return (
    <div>
      <div data-testid="user">{user ? user.email : "No user"}</div>
      <div data-testid="session">{session ? "Has session" : "No session"}</div>
      <div data-testid="loading">{loading ? "Loading" : "Not loading"}</div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

// Component to test context error
const TestComponentWithoutProvider = () => {
  useAuth();
  return <div>Should not render</div>;
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AuthProvider", () => {
    it("should provide initial loading state", () => {
      supabaseModule.supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      supabaseModule.supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId("loading")).toHaveTextContent("Loading");
    });

    it("should handle successful session retrieval", async () => {
      const mockSession = {
        user: { id: "user-1", email: "test@example.com" },
        access_token: "token-123",
      };

      supabaseModule.supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      supabaseModule.supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for the initial session to be processed
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(screen.getByTestId("user")).toHaveTextContent("test@example.com");
      expect(screen.getByTestId("session")).toHaveTextContent("Has session");
      expect(screen.getByTestId("loading")).toHaveTextContent("Not loading");
    });

    it("should handle no session", async () => {
      supabaseModule.supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      supabaseModule.supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(screen.getByTestId("user")).toHaveTextContent("No user");
      expect(screen.getByTestId("session")).toHaveTextContent("No session");
      expect(screen.getByTestId("loading")).toHaveTextContent("Not loading");
    });

    it("should handle auth state changes", async () => {
      let authStateChangeCallback;

      supabaseModule.supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      supabaseModule.supabase.auth.onAuthStateChange.mockImplementation(
        (callback) => {
          authStateChangeCallback = callback;
          return {
            data: { subscription: { unsubscribe: vi.fn() } },
          };
        }
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for initial render
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Simulate auth state change
      const newSession = {
        user: { id: "user-2", email: "newuser@example.com" },
        access_token: "new-token",
      };

      await act(async () => {
        if (authStateChangeCallback) {
          authStateChangeCallback("SIGNED_IN", newSession);
        }
      });

      // Wait for state update
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(screen.getByTestId("user")).toHaveTextContent(
        "newuser@example.com"
      );
      expect(screen.getByTestId("session")).toHaveTextContent("Has session");
    });

    it("should call signOut when button is clicked", async () => {
      supabaseModule.supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      supabaseModule.supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for component to render
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      const signOutButton = screen.getByText("Sign Out");
      await act(async () => {
        signOutButton.click();
      });

      expect(supabaseModule.supabase.auth.signOut).toHaveBeenCalled();
    });

    it("should cleanup subscription on unmount", () => {
      const mockUnsubscribe = vi.fn();

      supabaseModule.supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      supabaseModule.supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      });

      const { unmount } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for component to mount and set up subscription
      act(() => {
        // Force a re-render to ensure subscription is set up
      });

      unmount();
      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe("useAuth hook", () => {
    it("should throw error when used outside AuthProvider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow("useAuth must be used within an AuthProvider");

      consoleSpy.mockRestore();
    });
  });
});
