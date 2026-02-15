import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchOrder() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const value = query.trim();
    if (!value) return;

    const normalized = value.toLowerCase();
    if (normalized === "cart" || normalized === "/cart") {
      navigate("/cart");
    } else if (normalized === "menu" || normalized === "/menu") {
      navigate("/menu");
    } else if (normalized === "home" || normalized === "/") {
      navigate("/");
    } else {
      navigate(`/order/${value}`);
    }

    setQuery("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Search order #"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-full px-4 py-2 text-sm bg-yellow-100 placeholder:text-stone-900 w-28 sm:w-64 sm:focus:w-72 transition-all duration-300 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-50 "
      />
    </form>
  );
}

export default SearchOrder;
