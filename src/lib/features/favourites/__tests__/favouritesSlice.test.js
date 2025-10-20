import { beforeEach, describe, expect, it, vi } from "vitest";
import favouritesReducer, {
  addFavourite,
  fetchFavourites,
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
        data: [
          { id: 1, country_name: "Test Country 1", user_id: "user-1" },
          { id: 2, country_name: "Test Country 2", user_id: "user-1" },
        ],
        error: null,
      }),
    }),
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { id: 3, country_name: "New Country", user_id: "user-1" },
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
};

vi.mock("../../supabase/supabase", () => ({
  supabase: mockSupabase,
}));

describe("favouritesSlice", () => {
  const initialState = {
    favourites: [],
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      expect(favouritesReducer(undefined, { type: "unknown" })).toEqual(
        initialState
      );
    });
  });

  describe("fetchFavourites", () => {
    it("should handle fetchFavourites.pending", () => {
      const action = { type: fetchFavourites.pending.type };
      const state = favouritesReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle fetchFavourites.fulfilled", async () => {
      const mockFavourites = [
        { id: 1, country_name: "Test Country 1" },
        { id: 2, country_name: "Test Country 2" },
      ];

      const action = {
        type: fetchFavourites.fulfilled.type,
        payload: mockFavourites,
      };

      const state = favouritesReducer(initialState, action);
      expect(state.favourites).toEqual(mockFavourites);
      expect(state.loading).toBe(false);
    });

    it("should handle fetchFavourites.rejected", () => {
      const action = {
        type: fetchFavourites.rejected.type,
        payload: "Error message",
      };

      const state = favouritesReducer(initialState, action);
      expect(state.loading).toBe(false);
    });
  });

  describe("addFavourite", () => {
    it("should handle addFavourite.pending", () => {
      const action = { type: addFavourite.pending.type };
      const state = favouritesReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle addFavourite.fulfilled", () => {
      const mockFavourite = { id: 3, country_name: "New Country" };
      const action = {
        type: addFavourite.fulfilled.type,
        payload: mockFavourite,
      };

      const state = favouritesReducer(initialState, action);
      expect(state.favourites).toContain(mockFavourite);
      expect(state.loading).toBe(false);
    });

    it("should handle addFavourite.rejected", () => {
      const action = {
        type: addFavourite.rejected.type,
        payload: "Error message",
      };

      const state = favouritesReducer(initialState, action);
      expect(state.loading).toBe(false);
    });
  });

  describe("removeFavourite", () => {
    const stateWithFavourites = {
      favourites: [
        { id: 1, country_name: "Test Country 1" },
        { id: 2, country_name: "Test Country 2" },
      ],
      loading: false,
    };

    it("should handle removeFavourite.pending", () => {
      const action = { type: removeFavourite.pending.type };
      const state = favouritesReducer(stateWithFavourites, action);
      expect(state.loading).toBe(true);
    });

    it("should handle removeFavourite.fulfilled", () => {
      const action = {
        type: removeFavourite.fulfilled.type,
        payload: "Test Country 1",
      };

      const state = favouritesReducer(stateWithFavourites, action);
      expect(state.favourites).toHaveLength(1);
      expect(state.favourites[0].country_name).toBe("Test Country 2");
      expect(state.loading).toBe(false);
    });

    it("should handle removeFavourite.rejected", () => {
      const action = {
        type: removeFavourite.rejected.type,
        payload: "Error message",
      };

      const state = favouritesReducer(stateWithFavourites, action);
      expect(state.loading).toBe(false);
    });
  });

  describe("async thunk integration", () => {
    it("should dispatch fetchFavourites successfully", async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      await fetchFavourites()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchFavourites.pending.type,
        })
      );
    });

    it("should dispatch addFavourite successfully", async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const countryData = {
        name: { common: "New Country" },
        flags: { svg: "flag.svg" },
      };

      await addFavourite(countryData)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: addFavourite.pending.type,
        })
      );
    });

    it("should dispatch removeFavourite successfully", async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const countryName = "Test Country";

      await removeFavourite(countryName)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: removeFavourite.pending.type,
        })
      );
    });
  });
});
