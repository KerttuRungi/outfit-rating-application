import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RatingStars from "../components/atoms/RatingStars";
import "@testing-library/jest-dom";

beforeEach(() => {
  // noop
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("RatingStars", () => {
  describe("Rendering", () => {
    it("renders 5 star buttons inside a radiogroup", () => {
      render(<RatingStars />);

      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(5);
    });

    it("labels each star correctly", () => {
      render(<RatingStars />);

      expect(screen.getByLabelText("1 star")).toBeInTheDocument();
      expect(screen.getByLabelText("2 star")).toBeInTheDocument();
      expect(screen.getByLabelText("5 star")).toBeInTheDocument();
    });

    it("renders with the provided value reflected visually", () => {
      render(<RatingStars value={3} />);

      // the 4th star should be inactive
      const star4 = screen.getByLabelText("4 star");
      expect(star4.querySelector("svg")).toHaveClass("text-lgray");
    });

    it("does not render the loading spinner by default", () => {
      render(<RatingStars />);
      // the component does not include loading state
      expect(document.querySelector(".animate-spin")).not.toBeInTheDocument();
    });
  });

  describe("readOnly mode", () => {
    it("does not call rateOutfit when clicked in readOnly mode", async () => {
      const onChange = jest.fn();
      render(<RatingStars value={2} readOnly onChange={onChange} />);

      await userEvent.click(screen.getByLabelText("4 star"));

      expect(onChange).not.toHaveBeenCalled();
    });

    it("shows a default cursor in readOnly mode", () => {
      render(<RatingStars readOnly />);

      screen.getAllByRole("button").forEach((btn) => {
        expect(btn).toHaveClass("disabled:cursor-default");
      });
    });
  });

  describe("Click interaction", () => {
    it("calls onChange with the clicked star value immediately", async () => {
      const onChange = jest.fn();

      render(<RatingStars outfitId={1} value={0} onChange={onChange} />);

      await userEvent.click(screen.getByLabelText("3 star"));

      expect(onChange).toHaveBeenCalledWith(3);
    });

    it("does not throw when onChange is not provided", async () => {
      render(<RatingStars outfitId={1} value={0} />);

      await userEvent.click(screen.getByLabelText("1 star"));
    });
  });

  describe("Loading state", () => {
    it("does not manage loading internally (handled by parent)", () => {
      render(<RatingStars value={0} />);
      expect(document.querySelector(".animate-spin")).not.toBeInTheDocument();
    });
  });

  describe("Hover interaction", () => {
    it("highlights stars up to the hovered star on mouse enter", () => {
      render(<RatingStars value={0} />);

      const star3 = screen.getByLabelText("3 star");
      fireEvent.mouseEnter(star3);

      // Stars 1-3 should be active (text-(--dpink), star 4 should not
      const star4 = screen.getByLabelText("4 star");
      expect(star4.querySelector("svg")).toHaveClass("text-lgray");
    });

    it("resets star highlighting on mouse leave", () => {
      render(<RatingStars value={1} />);

      const star5 = screen.getByLabelText("5 star");
      fireEvent.mouseEnter(star5);
      fireEvent.mouseLeave(star5);

      // After leave, only star 1 should be active
      const star2 = screen.getByLabelText("2 star");
      expect(star2.querySelector("svg")).toHaveClass("text-lgray");
    });

    it("does not change hover state in readOnly mode", () => {
      render(<RatingStars value={2} readOnly />);

      const star5 = screen.getByLabelText("5 star");
      fireEvent.mouseEnter(star5);

      // Star 3 should remain inactive because hover is suppressed in readOnly
      const star3 = screen.getByLabelText("3 star");
      expect(star3.querySelector("svg")).toHaveClass("text-lgray");
    });
  });
});
