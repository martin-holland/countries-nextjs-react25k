import { describe, expect, it } from "vitest";

// Mock Next.js request
const createMockRequest = () => ({
  url: "http://localhost:3000/api/test",
  method: "GET",
  headers: new Headers(),
});

describe("API Route: /api/test", () => {
  it("should return a successful response", async () => {
    // Import the route handler dynamically
    const { GET } = await import("../route.js");

    const mockRequest = createMockRequest();

    const response = await GET(mockRequest);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
  });

  it("should return response with request keys", async () => {
    const { GET } = await import("../route.js");

    const mockRequest = createMockRequest();

    const response = await GET(mockRequest);
    const responseText = await response.text();

    // The route returns Object.keys(request), so we expect some keys
    expect(responseText).toContain("url");
    expect(responseText).toContain("method");
    expect(responseText).toContain("headers");
  });
});
