import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import Cart from "../components/Cart";
import Pagination from "../components/Pagination";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; 

type Product = Record<string, any>;

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [favourites, setFavourites] = useState<number[]>(() =>
        JSON.parse(localStorage.getItem("favourites") || "[]")
    );
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit] = useState(12);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const didMountRef = useRef(false);

    const handleFavouriteCart = useCallback(
        (id: number) => {
            const updated = favourites.includes(id)
                ? favourites.filter((fav) => fav !== id)
                : [...favourites, id];
            setFavourites(updated);
            localStorage.setItem("favourites", JSON.stringify(updated));
        },
        [favourites]
    );

    const handlePageChange = useCallback(
        (newPage: number) => {
            setPage(newPage);
            fetchProducts(searchValue, newPage);
        },
        [searchValue]
    );

    const fetchProducts = async (query = "", newPage = 1) => {
        setLoading(true);
        setError("");
        try {
            const skip = (newPage - 1) * limit;
            const response = await axios.get(
                `${BASE_URL}/products/search?q=${query}&limit=${limit}&skip=${skip}`
            );
            setProducts(response.data.products);
            setTotalPages(Math.ceil(response.data.total / limit));
        } catch (err: any) {
            setError(err.message || "Failed to fetch products");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!didMountRef.current) {
            fetchProducts("", 1);
            didMountRef.current = true;
        }
    }, []);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            const trimmed = value.trim();
            const validPattern = /^[a-zA-Z0-9\s]*$/;

            if (!validPattern.test(trimmed)) {
                setError("Special characters are not allowed.");
                setProducts([]);
                return;
            }

            setError("");
            setPage(1);
            fetchProducts(trimmed || "", 1);
        }, 600);
    };

    return (
        <div className="p-6">
            <SearchBar
                value={searchValue}
                placeholder="Search products..."
                onChange={handleSearchChange}
            />

            {(error || loading) && (
                <p className="text-center text-red-500">{error || "Loading products..."}</p>
            )}

            {!loading && !error && products.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {products.map((item) => (
                            <Cart
                                key={item.id}
                                item={item}
                                isFavourite={favourites.includes(item.id)}
                                onFavouriteToggle={handleFavouriteCart}
                            />
                        ))}
                    </div>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default ProductList;