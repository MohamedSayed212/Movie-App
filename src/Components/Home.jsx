import React, { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import ResultCard from "./ResultCard";

function Home() {
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

  const writeItems = (storageKey, items) => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  const saveKeys = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
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
      return;
    }

    // Add to watchlist
    const nextWatchlist = Array.from(new Set([...watchlistKeys, videoKey]));
    setWatchlistKeys(nextWatchlist);
    saveKeys(WATCHLIST_KEYS_KEY, nextWatchlist);

    const watchlistItems = readItems(WATCHLIST_ITEMS_KEY);
    if (!watchlistItems.some((item) => getItemKey(item) === videoKey)) {
      watchlistItems.push(video);
      writeItems(WATCHLIST_ITEMS_KEY, watchlistItems);
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

    // If it was in watchlist, remove it (move -> watched)
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

    const watchedItems = readItems(WATCHED_ITEMS_KEY);
    if (!watchedItems.some((item) => getItemKey(item) === videoKey)) {
      watchedItems.push(video);
      writeItems(WATCHED_ITEMS_KEY, watchedItems);
    }
  };

  const defaultItems = [
    "Spider-Man: No Way Home",
    "The Dark Knight",
    "The Godfather",
    "Game of Thrones",
    "Peaky Blinders",
    "Breaking Bad",
    "The Walking Dead",
    "Interstellar",
    "Harry Potter and the Philosopher's Stone ",
    "The Lord of the Rings: The Fellowship of the Ring ",
    "Fight Club",
    "Inception",
    "Gladiator",
    "Aliens",
    "Joker",
    "Jurassic Park",
    "The Boys",
    "Stranger Things",
    "The Office ",
  ];

  // Fetch default items once
  useEffect(() => {
    const fetchDefaultItems = async () => {
      try {
        const promises = defaultItems.map(async (title) => {
          const query = title.replace(/\s+/g, "+");
          const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`,
          );
          const data = await res.json();
          // return the first result if exists
          return data.results[0];
        });

        const results = await Promise.all(promises);
        setVideos(results.filter(Boolean)); // remove any undefined results
      } catch (error) {
        console.error("Error fetching default items:", error);
      }
    };

    fetchDefaultItems();
  }, [API_KEY]);

  // Search effect
  useEffect(() => {
    const fetchSearch = async () => {
      if (searchValue.trim() === "") return; // if search is empty, keep default videos

      try {
        const query = searchValue.trim().replace(/\s+/g, "+");
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`,
        );
        const data = await res.json();
        setVideos(data.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearch();
  }, [searchValue, API_KEY]);

  return (
    <div>
      <div className="container">
        <div className="pt-[200px] text-white">
          <h1>MovieX</h1>
          <p className="text-[#cac9c9] mt-[15px] w-full">
            A modern movie and TV shows app discover your favorite content
            <br /> Easily organize what you’ve seen and what you want to watch.
          </p>

          <div className="text-white mt-[30px] w-full">
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
            <p className="mt-10 text-gray-400">No movies or shows found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
