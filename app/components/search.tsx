"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Suggestion } from "../../convex/movies";

export default function AutocompleteSearch({
  handleSuggestionClick,
}: {
  handleSuggestionClick: (suggestion: Suggestion) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue] = useDebounce(inputValue, 300);
  const { data: suggestions, isLoading } = useQuery(
    convexQuery(api.movies.searchMovies, {
      searchTerm: debouncedValue,
    })
  );
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex > -1) {
                setInputValue("");
      handleSuggestionClick(suggestions[selectedIndex]);
    }
  };

  useEffect(() => {
    if (selectedIndex > -1 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600 focus:outline-none">
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </button>
      </div>
      {suggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              ref={(el) => (suggestionRefs.current[index] = el)}
              className={`px-4 py-2 cursor-pointer ${
                index === selectedIndex ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setInputValue("");
                handleSuggestionClick(suggestion);
            }}
            >
              {suggestion.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
