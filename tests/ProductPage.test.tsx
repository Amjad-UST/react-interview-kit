import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import ProductPage from "../src/Pages/ProductPage";
import userEvent from "@testing-library/user-event";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, { deep: true });

describe("ProductPage Test Cases", () => {
  const ProductData = {
    products: [
      {
        id: 1,
        title: "iPhone 15",
        description: "Latest Apple iPhone",
        price: 999,
        rating: 4.8,
        category: "smartphones",
        thumbnail: "https://dummyimage.com/200x200",
      },
      {
        id: 2,
        title: "Samsung S24",
        description: "Latest Samsung Galaxy",
        price: 899,
        rating: 4.6,
        category: "mobiles",
        thumbnail: "https://dummyimage.com/200x200",
      },
    ],
    total: 20,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders products on initial API call", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: ProductData });
    render(<ProductPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/iPhone 15/i)).toBeInTheDocument();
    expect(await screen.findByText(/Samsung S24/i)).toBeInTheDocument();
  });

  it("shows error message if API call fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));
    render(<ProductPage />);
    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });

  it("fetches and displays search results", async () => {
    mockedAxios.get.mockResolvedValue({ data: ProductData });
    render(<ProductPage />);
    const searchInput = screen.getByPlaceholderText(/search products/i);
    await userEvent.type(searchInput, "iPhone");
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("q=iPhone")
      );
    });
    expect(await screen.findByText(/iPhone 15/i)).toBeInTheDocument();
  });

  it("calls API again when search field is cleared", async () => {
    mockedAxios.get.mockResolvedValue({ data: ProductData });
    render(<ProductPage />);
    const searchInput = screen.getByPlaceholderText(/search products/i);
    await userEvent.type(searchInput, "iPhone");
    await userEvent.clear(searchInput);
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
  });

  it("handles favourites add and remove correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: ProductData });
    render(<ProductPage />);
    await waitFor(() => {
      expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    });

    const favButton = screen.getByTestId("fav-button-1");
    await userEvent.click(favButton);

    expect(favButton).toHaveTextContent(/Remove Favourite/i);
    const storedFavs = JSON.parse(localStorage.getItem("favourites") || "[]");

    expect(storedFavs).toEqual([ProductData.products[0].id]);
    await userEvent.click(favButton);

    expect(favButton).toHaveTextContent(/Add to Favourite/i);
    const storedAfterRemove = JSON.parse(localStorage.getItem("favourites") || "[]");

    expect(storedAfterRemove).toEqual([]);
  });

  it("handles pagination correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: ProductData });
    render(<ProductPage />);
    const nextButton = await screen.findByTestId("next-button");
    await userEvent.click(nextButton);
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
  });

  it("disables previous button on first page", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: ProductData });
    render(<ProductPage />);
    const prevButton = await screen.findByTestId("prev-button");
    expect(prevButton).toBeDisabled();
  });
});
