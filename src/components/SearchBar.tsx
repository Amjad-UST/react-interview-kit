import React, { useRef } from "react";

type SearchBarProps = {
  onSearch: (value: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search..." }) => {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Clear previous timer before setting a new one
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Debounce input
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        data-testid="search-input"
      />
    </div>
  );
};

export default SearchBar;
