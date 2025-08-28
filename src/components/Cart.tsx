import React from "react";

type CartProps = {
  item: Record<string, any>;
  isFavourite: boolean;
  onFavouriteToggle: (id: number) => void;
};

const Cart: React.FC<CartProps> = ({ item, isFavourite, onFavouriteToggle }) => {
  return (
    <div
      className={`bg-white border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 ${isFavourite ? "border-yellow-400 shadow-yellow-300" : "border-gray-200"
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
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold text-green-600">${item.price}</span>
          <span className="bg-yellow-400 text-black px-2 py-1 rounded-lg text-xs font-medium">
            ⭐ {item.rating}
          </span>
        </div>
        <button
          onClick={() => onFavouriteToggle(item.id)}
          data-testid={`fav-button-${item.id}`}
          className={`mt-3 w-full px-4 py-2 font-semibold rounded-lg shadow transition-transform duration-300 ${isFavourite
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
        >
          {isFavourite ? "Remove Favourite" : "Add to Favourite"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
