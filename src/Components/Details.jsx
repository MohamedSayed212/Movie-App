import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function Details() {
  const location = useLocation();
  const video = location.state?.video; // this is the object we passed

  const toastTimerRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (message) => {
    setToastMessage(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(""), 1200);
  };

  const videoKey = useMemo(() => {
    // Support both TMDB objects (`id`) and OMDB objects (`imdbID`)
    if (!video) return null;
    if (video.id) return `tmdb:${video.id}`;
    if (video.imdbID) return `omdb:${video.imdbID}`;
    return null;
  }, [video]);

  const [watchlistKeys, setWatchlistKeys] = useState(() => {
    const wlRaw = localStorage.getItem("movie_app_watchlist");
    if (!wlRaw) return [];
    try {
      const parsed = JSON.parse(wlRaw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [watchedKeys, setWatchedKeys] = useState(() => {
    const wdRaw = localStorage.getItem("movie_app_watched");
    if (!wdRaw) return [];
    try {
      const parsed = JSON.parse(wdRaw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const isInWatchlist = videoKey ? watchlistKeys.includes(videoKey) : false;
  const isWatched = videoKey ? watchedKeys.includes(videoKey) : false;

  // Note: watchlist/watched state is loaded from localStorage in useState initializers.

  const saveKeys = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const WATCHLIST_ITEMS_STORAGE_KEY = "movie_app_watchlist_items";
  const WATCHED_ITEMS_STORAGE_KEY = "movie_app_watched_items";

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

  const getItemKey = (item) => {
    if (!item) return null;
    if (item.id) return `tmdb:${item.id}`;
    if (item.imdbID) return `omdb:${item.imdbID}`;
    return null;
  };

  const handleAddToWatchlist = () => {
    if (!videoKey) return;

    if (isInWatchlist) {
      // Toggle off from Watchlist
      const nextWatchlist = watchlistKeys.filter((k) => k !== videoKey);
      setWatchlistKeys(nextWatchlist);
      saveKeys("movie_app_watchlist", nextWatchlist);

      const wlItems = readItems(WATCHLIST_ITEMS_STORAGE_KEY).filter(
        (item) => getItemKey(item) !== videoKey,
      );
      writeItems(WATCHLIST_ITEMS_STORAGE_KEY, wlItems);

      showToast("Removed from Watchlist");
      return;
    }

    // If it was watched, remove it from watched first (move -> watchlist)
    if (isWatched) {
      const nextWatched = watchedKeys.filter((k) => k !== videoKey);
      setWatchedKeys(nextWatched);
      saveKeys("movie_app_watched", nextWatched);

      const wdItems = readItems(WATCHED_ITEMS_STORAGE_KEY).filter(
        (item) => getItemKey(item) !== videoKey,
      );
      writeItems(WATCHED_ITEMS_STORAGE_KEY, wdItems);
    }

    // Add to Watchlist
    const nextWatchlist = Array.from(new Set([...watchlistKeys, videoKey]));
    setWatchlistKeys(nextWatchlist);
    saveKeys("movie_app_watchlist", nextWatchlist);

    const wlItems = readItems(WATCHLIST_ITEMS_STORAGE_KEY);
    if (!wlItems.some((item) => getItemKey(item) === videoKey)) {
      wlItems.push(video);
      writeItems(WATCHLIST_ITEMS_STORAGE_KEY, wlItems);
    }

    showToast("Added to Watchlist");
  };

  const handleAddToWatched = () => {
    if (!videoKey) return;

    if (isWatched) {
      // Toggle off from Watched
      const nextWatched = watchedKeys.filter((k) => k !== videoKey);
      setWatchedKeys(nextWatched);
      saveKeys("movie_app_watched", nextWatched);

      const wdItems = readItems(WATCHED_ITEMS_STORAGE_KEY).filter(
        (item) => getItemKey(item) !== videoKey,
      );
      writeItems(WATCHED_ITEMS_STORAGE_KEY, wdItems);

      showToast("Removed from Watched");
      return;
    }

    // If it was in watchlist, remove it first (move -> watched)
    if (isInWatchlist) {
      const nextWatchlist = watchlistKeys.filter((k) => k !== videoKey);
      setWatchlistKeys(nextWatchlist);
      saveKeys("movie_app_watchlist", nextWatchlist);

      const wlItems = readItems(WATCHLIST_ITEMS_STORAGE_KEY).filter(
        (item) => getItemKey(item) !== videoKey,
      );
      writeItems(WATCHLIST_ITEMS_STORAGE_KEY, wlItems);
    }

    // Add to Watched
    const nextWatched = Array.from(new Set([...watchedKeys, videoKey]));
    setWatchedKeys(nextWatched);
    saveKeys("movie_app_watched", nextWatched);

    const wdItems = readItems(WATCHED_ITEMS_STORAGE_KEY);
    if (!wdItems.some((item) => getItemKey(item) === videoKey)) {
      wdItems.push(video);
      writeItems(WATCHED_ITEMS_STORAGE_KEY, wdItems);
    }

    showToast("Added to Watched");
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // ...rest of your component
  if (!video) {
    return (
      <div className="container text-white pt-[150px]">
        <h1 className="text-2xl font-bold">Details</h1>
        <p className="mt-3 text-gray-400">No item selected.</p>
      </div>
    );
  }

  const title = video.title || video.name || video.Title || "Details";
  const posterUrl = video.poster_path
    ? `https://image.tmdb.org/t/p/w500${video.poster_path}`
    : video.Poster && video.Poster !== "N/A"
      ? video.Poster
      : null;
  const year =
    video.release_date?.slice(0, 4) ||
    video.first_air_date?.slice(0, 4) ||
    video.Year ||
    "-";

  return (
    <div className="container text-white pt-[150px]">
      <h1 className="text-4xl font-bold">
        {title} ({year})
      </h1>

      {toastMessage ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div
            className="rounded-3xl border border-white/15 bg-[#1a1a1a]/85 px-10 py-6 text-white shadow-2xl backdrop-blur-md min-w-[320px] max-w-[520px]"
            role="status"
            aria-live="polite"
          >
            <div className="text-2xl font-extrabold leading-snug text-center">
              {toastMessage}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row mt-6 gap-6">
        {posterUrl && (
          <img
            src={posterUrl}
            alt={title}
            className="w-full md:w-[400px] rounded-[10px]"
          />
        )}
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-semibold">Overview:</h3>
          <p>{video.overview || video.Plot || "No overview available."}</p>

          <p>
            <strong>Media Type:</strong> {video.media_type || "-"}
          </p>
          <p>
            <strong>Vote Average:</strong> {video.vote_average ?? "-"}
          </p>
          <p>
            <strong>Vote Count:</strong> {video.vote_count ?? "-"}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleAddToWatchlist}
              disabled={!videoKey}
              className={`rounded-xl px-5 py-3 font-bold transition-colors ${
                isWatched || isInWatchlist
                  ? "bg-[#242424] text-white border border-white/15 hover:bg-[#2b2b2b]"
                  : "bg-[#1a1a1a] hover:bg-[#222222] text-white border border-white/15"
              }`}
            >
              {isWatched
                ? "Watched"
                : isInWatchlist
                  ? "In Watchlist"
                  : "Add to Watchlist"}
            </button>

            <button
              type="button"
              onClick={handleAddToWatched}
              disabled={!videoKey}
              className={`rounded-xl px-5 py-3 font-bold transition-colors ${
                isWatched
                  ? "bg-[#242424] text-white border border-white/15 hover:bg-[#2b2b2b]"
                  : "bg-[#1a1a1a] hover:bg-[#222222] text-white border border-white/15"
              }`}
            >
              {isWatched ? "Already Watched" : "Add to Watched"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
