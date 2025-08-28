import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import SearchBar from "../src/components/SearchBar";

describe("SearchBar Component", () => {
    it("renders with default placeholder", () => {
        render(<SearchBar value="" onChange={() => { }} />);
        expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
        render(<SearchBar value="" onChange={() => { }} placeholder="Search products..." />);
        expect(screen.getByPlaceholderText("Search products...")).toBeInTheDocument();
    });

    it("calls onChange when user types", async () => {
        let value = "";
        const handleChange = vi.fn((v) => {
            value = v;
            rerender(<SearchBar value={value} onChange={handleChange} />);
        });

        const { rerender } = render(<SearchBar value={value} onChange={handleChange} />);
        const input = screen.getByTestId("search-input") as HTMLInputElement;

        await userEvent.type(input, "iPhone");

        expect(handleChange).toHaveBeenCalledTimes(6);
        expect(value).toBe("iPhone");
    });

    it("shows the passed value in input", () => {
        render(<SearchBar value="TestValue" onChange={() => { }} />);
        const input = screen.getByTestId("search-input") as HTMLInputElement;
        expect(input.value).toBe("TestValue");
    });
});
