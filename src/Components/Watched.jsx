import React, { useMemo, useState } from "react";
import ResultCard from "./ResultCard";
import SearchInput from "./SearchInput";
function Watched() {
  const [items] = useState(() => {
    const raw = localStorage.getItem("movie_app_watched_items");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [searchValue, setSearchValue] = useState("");

  const getItemTitle = (item) => item?.title || item?.name || item?.Title || "";

  const list = useMemo(() => {
    if (!searchValue.trim()) return items;
    const q = searchValue.trim().toLowerCase();
    return items.filter((item) => getItemTitle(item).toLowerCase().includes(q));
  }, [items, searchValue]);

  return (
    <div className="container pt-[200px] text-white">
      <h1 className="text-4xl font-bold">Watched</h1>

      <div className="text-white mt-[30px] w-full">
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>

      {list.length > 0 ? (
        <ul className="results mt-10 grid grid-cols-1 gap-[24px] sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {list.map((video) => (
            <li key={video.id ?? video.imdbID}>
              <ResultCard Video={video} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-gray-400">
          You have not watched anything yet.
        </p>
      )}
    </div>
  );
}

export default Watched;
