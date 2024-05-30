import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { setupServer } from "msw/node";
import { SWRConfig } from "swr";
import { rest } from "msw";
import AuthButtons from "./AuthButtons";

// SWRConfig - swr caches the api response and hence you need to reset the cache during component render
function renderComponent() {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );
}

describe("When user is not signed in", () => {
  const handlers = [
    rest.get("/api/user", (req, res, ctx) => {
      return res(ctx.json({ user: null }));
    }),
  ];

  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test("should show sign in and sign up buttons", async () => {
    renderComponent();

    const signInButton = await screen.findByRole("link", { name: /sign in/i });
    const signUpButton = await screen.findByRole("link", { name: /sign up/i });

    expect(signInButton).toBeVisible();
    expect(signInButton).toHaveAttribute("href", "/signin");

    expect(signUpButton).toBeVisible();
    expect(signUpButton).toHaveAttribute("href", "/signup");
  });

  test("should not show sign out button", async () => {
    renderComponent();

    await screen.findByRole("link", { name: /sign in/i }); // Wait for the async component to render

    const signOutButton = screen.queryByRole("link", {
      name: /sign out/i,
    });

    expect(signOutButton).toBe(null);
  });
});

describe("when user is signed in", () => {
  const handlers = [
    rest.get("/api/user", (req, res, ctx) => {
      return res(ctx.json({ user: { id: 1, email: "demo@test.com" } }));
    }),
  ];

  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test("should not show sign in and sign up buttons", async () => {
    renderComponent();

    await screen.findByRole("link", {
      name: /sign out/i,
    });

    const signInButton = screen.queryByRole("link", { name: /sign in/i });
    const signUpButton = screen.queryByRole("link", { name: /sign up/i });

    expect(signInButton).toBe(null);
    expect(signUpButton).toBe(null);
  });

  test("should show sign out button", async () => {
    renderComponent();

    const signOutButton = await screen.findByRole("link", {
      name: /sign out/i,
    });

    expect(signOutButton).toBeVisible();
    expect(signOutButton).toHaveAttribute("href", "/signout");
  });
});
