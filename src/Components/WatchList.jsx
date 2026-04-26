import React, { useMemo, useState } from "react";
import ResultCard from "./ResultCard";
import SearchInput from "./SearchInput";
function WatchList() {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem("movie_app_watchlist_items");
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

  const getItemKey = (item) => {
    if (!item) return null;
    if (item.id) return `tmdb:${item.id}`;
    if (item.imdbID) return `omdb:${item.imdbID}`;
    return null;
  };

  const readItems = (storageKey) => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const writeItems = (storageKey, next) => {
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const handleAddToWatched = (video) => {
    const videoKey = getItemKey(video);
    if (!videoKey) return;

    const WATCHLIST_KEYS_KEY = "movie_app_watchlist";
    const WATCHED_KEYS_KEY = "movie_app_watched";
    const WATCHLIST_ITEMS_KEY = "movie_app_watchlist_items";
    const WATCHED_ITEMS_KEY = "movie_app_watched_items";

    const watchlistKeys = readItems(WATCHLIST_KEYS_KEY);
    const watchedKeys = readItems(WATCHED_KEYS_KEY);

    const watchlistItems = readItems(WATCHLIST_ITEMS_KEY);
    const watchedItems = readItems(WATCHED_ITEMS_KEY);

    const nextWatchlistKeys = watchlistKeys.filter((k) => k !== videoKey);
    const nextWatchedKeys = watchedKeys.includes(videoKey)
      ? watchedKeys
      : [...watchedKeys, videoKey];

    const nextWatchlistItems = watchlistItems.filter(
      (item) => getItemKey(item) !== videoKey,
    );
    const nextWatchedItems = watchedItems.some(
      (item) => getItemKey(item) === videoKey,
    )
      ? watchedItems
      : [...watchedItems, video];

    writeItems(WATCHLIST_KEYS_KEY, nextWatchlistKeys);
    writeItems(WATCHED_KEYS_KEY, nextWatchedKeys);
    writeItems(WATCHLIST_ITEMS_KEY, nextWatchlistItems);
    writeItems(WATCHED_ITEMS_KEY, nextWatchedItems);

    // Update UI immediately
    setItems(nextWatchlistItems);
  };

  return (
    <div className="container pt-[200px] text-white">
      <h1 className="text-4xl font-bold">Watchlist</h1>

      <div className="text-white mt-[30px] w-full">
        <SearchInput searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      {list.length > 0 ? (
        <ul className="results mt-10 grid grid-cols-1 gap-[24px] sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {list.map((video) => (
            <li key={video.id ?? video.imdbID} className="space-y-3">
              <ResultCard Video={video} />
              <button
                type="button"
                onClick={() => handleAddToWatched(video)}
                className="w-full rounded-xl bg-[#1a1a1a] px-4 py-3 font-bold border border-white/15 hover:bg-[#222222] transition-colors text-white"
              >
                Add to Watched
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-gray-400">Your watchlist is empty.</p>
      )}
    </div>
  );
}

export default WatchList;
