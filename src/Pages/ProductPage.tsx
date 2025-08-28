import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// import SearchBar from "../components/SearchBar";

type Product = Record<string, any>;

const ProductPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [favourites, setFavourites] = useState<number[]>(
        JSON.parse(localStorage.getItem("favourites") || "[]")
    );
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit] = useState(12);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const initialRender = useRef(true);

    const fetchProducts = async (query = searchValue, newPage = page) => {
        try {
            setLoading(true);
            setError("");
            const skip = (newPage - 1) * limit;

            const response = await axios.get(
                `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}`
            );

            setProducts(response.data.products);
            setTotalPages(Math.ceil(response.data.total / limit));
        } catch(err: any) {
            setError(err.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialRender.current) {
            fetchProducts();
            initialRender.current = false;
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            const trimmedSearchValue = searchValue.trim();
            const validPattern = /^[a-zA-Z0-9\s]*$/;
            if (!validPattern.test(trimmedSearchValue)) {
                setError("Special characters are not allowed.");
                setProducts([]);
                return;
            }
            setError("");
            if (trimmedSearchValue !== "") {
                setPage(1);
                fetchProducts(trimmedSearchValue, 1);
            } else {
                fetchProducts("", 1);
            }
        }, 600);
        return () => clearTimeout(handler);
    }, [searchValue]);

    const handleFavourite = (id: number) => {
        let updatedFavourites;
        if (favourites.includes(id)) {
            updatedFavourites = favourites.filter((fav) => fav !== id);
        } else {
            updatedFavourites = [...favourites, id];
        }
        setFavourites(updatedFavourites);
        localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchProducts(searchValue, newPage);
    };

    return (
        <div className="p-6">
            <div className="max-w-md mx-auto mb-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="border p-2 mb-4 w-full rounded shadow"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            {/* <SearchBar onSearch={handleSearch} placeholder="Search products..." /> */}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {loading && <p className="text-center">Loading products...</p>}

            {!loading && !error && products.length !== 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                    {products.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 ${
                                favourites.includes(item.id)
                                    ? "border-yellow-400 shadow-yellow-300"
                                    : "border-gray-200"
                            }`}
                        >
                            <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                />
                                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow">
                                    {item.category}
                                </span>
                            </div>
                            <div className="p-4 flex flex-col justify-between h-[250px]">
                                <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                                    {item.title}
                                </h2>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {item.description}
                                </p>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-lg font-bold text-green-600">
                                        ${item.price}
                                    </span>
                                    <span className="bg-yellow-400 text-black px-2 py-1 rounded-lg text-xs font-medium">
                                        ⭐ {item.rating}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleFavourite(item.id)}
                                    data-testid={`fav-button-${item.id}`}
                                    className={`mt-3 w-full px-4 py-2 font-semibold rounded-lg shadow transition-transform duration-300 ${
                                        favourites.includes(item.id)
                                            ? "bg-red-500 text-white hover:bg-red-600"
                                            : "bg-gray-200 text-black hover:bg-gray-300"
                                    }`}
                                >
                                    {favourites.includes(item.id)
                                        ? "Remove Favourite"
                                        : "Add to Favourite"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && !error && products.length !== 0 && (
                <div className="mt-4 flex justify-center gap-4 items-center max-w-md mx-auto">
                    <button
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                        data-testid="prev-button"
                        className={`px-4 py-2 bg-blue-500 text-white rounded ${
                            page === 1 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        Previous
                    </button>
                    <p className="font-medium">
                        {page} of {totalPages} total Pages
                    </p>
                    <button
                        disabled={page === totalPages}
                        onClick={() => handlePageChange(page + 1)}
                        data-testid="next-button"
                        className={`px-4 py-2 bg-blue-500 text-white rounded ${
                            page === totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductPage;
