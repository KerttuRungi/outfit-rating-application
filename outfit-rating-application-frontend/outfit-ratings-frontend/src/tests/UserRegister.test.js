import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserRegister from "../components/organisms/UserRegister";
import { register, login } from "@/services/authService";
import "@testing-library/jest-dom";

// Mock services
jest.mock("@/services/authService", () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

// Mock router
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

describe("UserRegister", () => {
  describe("Rendering", () => {
    it("renders the register form", () => {
      render(<UserRegister />);

      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/confirm password/i),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /create an account/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("shows error when email is empty", async () => {
      render(<UserRegister />);

      await userEvent.click(
        screen.getByRole("button", { name: /create an account/i }),
      );

      expect(await screen.findByText(/enter email/i)).toBeInTheDocument();
      expect(register).not.toHaveBeenCalled();
    });

    it("shows error when email is invalid", async () => {
      render(<UserRegister />);

      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "invalidemail",
      );

      await userEvent.type(
        screen.getByPlaceholderText(/^password$/i),
        "Password1!",
      );

      await userEvent.click(
        screen.getByRole("button", { name: /create an account/i }),
      );

      expect(
        await screen.findByText(/invalid email format/i),
      ).toBeInTheDocument();

      expect(register).not.toHaveBeenCalled();
    });

    it("shows error when password is empty", async () => {
      render(<UserRegister />);

      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com",
      );

      await userEvent.click(
        screen.getByRole("button", { name: /create an account/i }),
      );

      expect(await screen.findByText(/enter password/i)).toBeInTheDocument();

      expect(register).not.toHaveBeenCalled();
    });

    it("shows error when passwords do not match", async () => {
      render(<UserRegister />);

      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com",
      );

      await userEvent.type(
        screen.getByPlaceholderText(/^password$/i),
        "Password1!",
      );

      await userEvent.type(
        screen.getByPlaceholderText(/confirm password/i),
        "Different1!",
      );

      await userEvent.click(
        screen.getByRole("button", { name: /create an account/i }),
      );

      const matches = await screen.findAllByText(/passwords do not match/i);
      expect(matches).toHaveLength(2);

      expect(register).not.toHaveBeenCalled();
    });

    it("shows error when password does not meet complexity requirements", async () => {
      render(<UserRegister />);

      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com",
      );

      await userEvent.type(screen.getByPlaceholderText(/^password$/i), "short");

      await userEvent.type(
        screen.getByPlaceholderText(/confirm password/i),
        "short",
      );

      await userEvent.click(
        screen.getByRole("button", { name: /create an account/i }),
      );

      expect(
        await screen.findByText(/password must be at least 8 character/i),
      ).toBeInTheDocument();

      expect(register).not.toHaveBeenCalled();
    });
  });

  describe("Submission", () => {
    it("calls register with valid credentials", async () => {
      register.mockResolvedValueOnce({});
      login.mockResolvedValueOnce({});

      render(<UserRegister />);

      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com",
      );

      await userEvent.type(
        screen.getByPlaceholderText(/^password$/i),
        "Password1!",
      );

      await userEvent.type(
        screen.getByPlaceholderText(/confirm password/i),
        "Password1!",
      );

      await userEvent.click(
        screen.getByRole("button", { name: /create an account/i }),
      );

      await waitFor(() => {
        expect(register).toHaveBeenCalledWith("test@example.com", "Password1!");
      });
    });

    it("calls login after successful registration", async () => {
      register.mockResolvedValueOnce({});
      login.mockResolvedValueOnce({});

      render(<UserRegister />);

      await userEvent.type(
        screen.getByPlaceholderText(/email/i),
        "test@example.com",
      );

      await userEvent.type(
        screen.getByPlaceholderText(/^password$/i),
        "Password1!",
      );

      await userEvent.type(
        screen.getByPlaceholderText(/confirm password/i),
        "Password1!",
      );

      await userEvent.click(
        screen.getByRole("button", { name: /create an account/i }),
      );

      await waitFor(() => {
        expect(login).toHaveBeenCalledWith("test@example.com", "Password1!");
      });
    });
  });
});
