import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Pagination from "../src/components/Pagination";

describe("Pagination Component", () => {
    const onPageChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders current page and total pages correctly", () => {
        render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
        expect(screen.getByText("2 of 5 total Pages")).toBeInTheDocument();
    });

    it("disables previous button on first page", () => {
        render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
        const prevButton = screen.getByTestId("prev-button") as HTMLButtonElement;
        expect(prevButton).toBeDisabled();
    });

    it("disables next button on last page", () => {
        render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);
        const nextButton = screen.getByTestId("next-button") as HTMLButtonElement;
        expect(nextButton).toBeDisabled();
    });

    it("calls onPageChange with correct value when previous button is clicked", async () => {
        render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
        const prevButton = screen.getByTestId("prev-button");
        await userEvent.click(prevButton);
        expect(onPageChange).toHaveBeenCalledOnce();
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("calls onPageChange with correct value when next button is clicked", async () => {
        render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
        const nextButton = screen.getByTestId("next-button");
        await userEvent.click(nextButton);
        expect(onPageChange).toHaveBeenCalledOnce();
        expect(onPageChange).toHaveBeenCalledWith(4);
    });
});
