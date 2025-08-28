import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import Cart from "../src/components/Cart";

describe("Cart Component", () => {
    const product = {
        id: 1,
        title: "iPhone 15",
        description: "Latest Apple iPhone",
        price: 999,
        rating: 4.8,
        category: "smartphones",
        thumbnail: "https://dummyimage.com/200x200",
    };

    const renderCart = (isFavourite = false, onToggle = () => { }) =>
        render(<Cart item={product} isFavourite={isFavourite} onFavouriteToggle={onToggle} />);

    it("renders product details correctly", () => {
        renderCart();

        expect(screen.getByText(product.title)).toBeInTheDocument();
        expect(screen.getByText(product.description)).toBeInTheDocument();
        expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
        expect(screen.getByText(`⭐ ${product.rating}`)).toBeInTheDocument();
        expect(screen.getByText(product.category)).toBeInTheDocument();
        expect(screen.getByRole("img")).toHaveAttribute("src", product.thumbnail);
    });

    it("shows correct favourite button text based on isFavourite prop", () => {
        renderCart(false);
        expect(screen.getByText("Add to Favourite")).toBeInTheDocument();

        renderCart(true);
        expect(screen.getByText("Remove Favourite")).toBeInTheDocument();
    });

    it("calls onFavouriteToggle with correct id when clicked", async () => {
        const mockToggle = vi.fn();
        renderCart(false, mockToggle);

        const favButton = screen.getByTestId(`fav-button-${product.id}`);
        await userEvent.click(favButton);

        expect(mockToggle).toHaveBeenCalledOnce();
        expect(mockToggle).toHaveBeenCalledWith(product.id);
    });
});
