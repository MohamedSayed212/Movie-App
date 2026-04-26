import React, { useState, useEffect } from "react";
import SearchInput from "./SearchInput";
import ResultCard from "./ResultCard";

function TVSeries() {
  const [searchValue, setSearchValue] = useState("");
  const [videos, setVideos] = useState([]);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  const [watchlistKeys, setWatchlistKeys] = useState(() => {
    const raw = localStorage.getItem("movie_app_watchlist");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [watchedKeys, setWatchedKeys] = useState(() => {
    const raw = localStorage.getItem("movie_app_watched");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

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

  const saveKeys = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const writeItems = (storageKey, next) => {
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const handleAddToWatchlist = (video) => {
    const videoKey = getItemKey(video);
    if (!videoKey) return;

    const isInWatchlist = watchlistKeys.includes(videoKey);
    const isWatched = watchedKeys.includes(videoKey);

    const WATCHLIST_KEYS_KEY = "movie_app_watchlist";
    const WATCHED_KEYS_KEY = "movie_app_watched";
    const WATCHLIST_ITEMS_KEY = "movie_app_watchlist_items";
    const WATCHED_ITEMS_KEY = "movie_app_watched_items";

    if (isInWatchlist) {
      const nextWatchlist = watchlistKeys.filter((k) => k !== videoKey);
      setWatchlistKeys(nextWatchlist);
      saveKeys(WATCHLIST_KEYS_KEY, nextWatchlist);

      const nextWatchlistItems = readItems(WATCHLIST_ITEMS_KEY).filter(
        (item) => getItemKey(item) !== videoKey,
      );
      writeItems(WATCHLIST_ITEMS_KEY, nextWatchlistItems);
      return;
    }

    if (isWatched) {
      const nextWatched = watchedKeys.filter((k) => k !== videoKey);
      setWatchedKeys(nextWatched);
      saveKeys(WATCHED_KEYS_KEY, nextWatched);

      const nextWatchedItems = readItems(WATCHED_ITEMS_KEY).filter(
        (item) => getItemKey(item) !== videoKey,
      );
      writeItems(WATCHED_ITEMS_KEY, nextWatchedItems);
    }

    const nextWatchlist = Array.from(new Set([...watchlistKeys, videoKey]));
    setWatchlistKeys(nextWatchlist);
    saveKeys(WATCHLIST_KEYS_KEY, nextWatchlist);

    const nextWatchlistItems = readItems(WATCHLIST_ITEMS_KEY);
    if (!nextWatchlistItems.some((item) => getItemKey(item) === videoKey)) {
      nextWatchlistItems.push(video);
      writeItems(WATCHLIST_ITEMS_KEY, nextWatchlistItems);
    }
  };

  const handleAddToWatched = (video) => {
    const videoKey = getItemKey(video);
    if (!videoKey) return;

    const isInWatchlist = watchlistKeys.includes(videoKey);
    const isWatched = watchedKeys.includes(videoKey);

    const WATCHLIST_KEYS_KEY = "movie_app_watchlist";
    const WATCHED_KEYS_KEY = "movie_app_watched";
    const WATCHLIST_ITEMS_KEY = "movie_app_watchlist_items";
    const WATCHED_ITEMS_KEY = "movie_app_watched_items";

    if (isWatched) {
      const nextWatched = watchedKeys.filter((k) => k !== videoKey);
      setWatchedKeys(nextWatched);
      saveKeys(WATCHED_KEYS_KEY, nextWatched);

      const nextWatchedItems = readItems(WATCHED_ITEMS_KEY).filter(
        (item) => getItemKey(item) !== videoKey,
      );
      writeItems(WATCHED_ITEMS_KEY, nextWatchedItems);
      return;
    }

    if (isInWatchlist) {
      const nextWatchlist = watchlistKeys.filter((k) => k !== videoKey);
      setWatchlistKeys(nextWatchlist);
      saveKeys(WATCHLIST_KEYS_KEY, nextWatchlist);

      const nextWatchlistItems = readItems(WATCHLIST_ITEMS_KEY).filter(
        (item) => getItemKey(item) !== videoKey,
      );
      writeItems(WATCHLIST_ITEMS_KEY, nextWatchlistItems);
    }

    const nextWatched = Array.from(new Set([...watchedKeys, videoKey]));
    setWatchedKeys(nextWatched);
    saveKeys(WATCHED_KEYS_KEY, nextWatched);

    const nextWatchedItems = readItems(WATCHED_ITEMS_KEY);
    if (!nextWatchedItems.some((item) => getItemKey(item) === videoKey)) {
      nextWatchedItems.push(video);
      writeItems(WATCHED_ITEMS_KEY, nextWatchedItems);
    }
  };

  useEffect(() => {
    const fetchTV = async () => {
      try {
        if (searchValue.trim() === "") {
          // Fetch multiple pages for popular TV
          const allResults = [];
          const pagesToFetch = [1, 2, 3]; // you can add more pages

          for (const page of pagesToFetch) {
            const res = await fetch(
              `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=${page}`,
            );
            const data = await res.json();
            allResults.push(...data.results);
          }

          setVideos(allResults);
        } else {
          // Search TV series
          const query = searchValue.trim().replace(/\s+/g, "+");
          const res = await fetch(
            `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`,
          );
          const data = await res.json();
          setVideos(data.results || []);
        }
      } catch (error) {
        console.error("Error fetching TV series:", error);
      }
    };

    fetchTV();
  }, [searchValue, API_KEY]);

  return (
    <div className="container pt-[200px] text-white">
      <h1 className="text-4xl font-bold">TV Series</h1>
      <div className="mt-[30px] w-full">
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>

      {videos.length > 0 ? (
        <ul className="results mt-10 grid grid-cols-1 gap-[24px] sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <li key={video.id}>
              <ResultCard
                Video={video}
                showActions
                onAddToWatchlist={() => handleAddToWatchlist(video)}
                onAddToWatched={() => handleAddToWatched(video)}
                isInWatchlist={watchlistKeys.includes(getItemKey(video))}
                isWatched={watchedKeys.includes(getItemKey(video))}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-gray-400">No TV series found.</p>
      )}
    </div>
  );
}

export default TVSeries;
