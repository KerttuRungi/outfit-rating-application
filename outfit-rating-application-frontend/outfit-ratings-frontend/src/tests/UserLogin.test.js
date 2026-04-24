// __tests__/UserLogin.test.jsx

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserLogin from "../components/organisms/UserLogin";
import { login } from "@/services/authService";
import "@testing-library/jest-dom";

// Mock auth service
jest.mock("@/services/authService", () => ({
  login: jest.fn(),
}));

// Mock next router
const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("UserLogin", () => {
  describe("Rendering", () => {
    it("renders inputs and submit button", () => {
      render(<UserLogin />);

      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /log in/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("shows email error when empty", async () => {
      render(<UserLogin />);

      await userEvent.click(screen.getByRole("button", { name: /log in/i }));

      expect(await screen.findByText(/enter email/i)).toBeInTheDocument();
      expect(login).not.toHaveBeenCalled();
    });

    it("shows email format error when invalid", async () => {
      render(<UserLogin />);

      await userEvent.type(screen.getByPlaceholderText(/email/i), "invalid");
      await userEvent.type(
        screen.getByPlaceholderText(/password/i),
        "Password1!",
      );

      await userEvent.click(screen.getByRole("button", { name: /log in/i }));

      expect(
        await screen.findByText(/invalid email format/i),
      ).toBeInTheDocument();
      expect(login).not.toHaveBeenCalled();
    });

    it("shows password error when empty", async () => {
      render(<UserLogin />);

      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com",
      );

      await userEvent.click(screen.getByRole("button", { name: /log in/i }));

      expect(await screen.findByText(/enter password/i)).toBeInTheDocument();
      expect(login).not.toHaveBeenCalled();
    });
  });

  describe("Input behavior", () => {
    it("clears email error when user types", async () => {
      render(<UserLogin />);

      await userEvent.click(screen.getByRole("button", { name: /log in/i }));

      expect(await screen.findByText(/enter email/i)).toBeInTheDocument();

      await userEvent.type(screen.getByPlaceholderText(/email/i), "a");

      expect(screen.queryByText(/enter email/i)).toBeNull();
    });
  });

  describe("Submission", () => {
    it("calls login with valid credentials", async () => {
      login.mockResolvedValueOnce({});

      render(<UserLogin />);

      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com",
      );
      await userEvent.type(
        screen.getByPlaceholderText(/password/i),
        "Password1!",
      );

      await userEvent.click(screen.getByRole("button", { name: /log in/i }));

      await waitFor(() => {
        expect(login).toHaveBeenCalledWith("test@example.com", "Password1!");
      });
    });

    it("redirects after successful login", async () => {
      login.mockResolvedValueOnce({});

      render(<UserLogin />);

      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com",
      );
      await userEvent.type(
        screen.getByPlaceholderText(/password/i),
        "Password1!",
      );

      await userEvent.click(screen.getByRole("button", { name: /log in/i }));

      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/explore");
        expect(refreshMock).toHaveBeenCalled();
      });
    });

    it("shows global error when login fails", async () => {
      login.mockRejectedValueOnce(new Error("fail"));

      render(<UserLogin />);

      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com",
      );
      await userEvent.type(
        screen.getByPlaceholderText(/password/i),
        "Password1!",
      );

      await userEvent.click(screen.getByRole("button", { name: /log in/i }));

      expect(
        await screen.findByText(/invalid email or password/i),
      ).toBeInTheDocument();
    });
  });

  describe("Loading state", () => {
    it("disables button and shows loading state while submitting", async () => {
      let resolvePromise;

      login.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          }),
      );

      render(<UserLogin />);

      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com",
      );
      await userEvent.type(
        screen.getByPlaceholderText(/password/i),
        "Password1!",
      );

      const button = screen.getByRole("button", { name: /log in/i });

      await userEvent.click(button);

      expect(button).toBeDisabled();
      expect(button).toHaveTextContent(/logging in/i);

      resolvePromise();

      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });
  });
});
