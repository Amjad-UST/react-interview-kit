import type { FC } from "react";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

const SearchBar: FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder = "Search...",
}) => {
    return (
        <div className="w-full max-w-md mx-auto my-4">
            <input
                type="text"
                placeholder={placeholder}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                data-testid="search-input"
            />
        </div>
    );
};

export default SearchBar;
