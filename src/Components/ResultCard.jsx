import React from "react";
import { useNavigate } from "react-router-dom";

function ResultCard({
  Video,
  showActions = false,
  onAddToWatchlist,
  onAddToWatched,
  isInWatchlist = false,
  isWatched = false,
}) {
  const navigate = useNavigate();

  const detailsId = Video?.id ?? Video?.imdbID;

  const handleClick = () => {
    if (!detailsId) return;
    navigate(`/details/${detailsId}`, { state: { video: Video } });
  };

  const title = Video?.title || Video?.name || Video?.Title || "";

  const posterUrl = Video?.poster_path
    ? `https://image.tmdb.org/t/p/w500${Video.poster_path}`
    : Video?.Poster && Video.Poster !== "N/A"
      ? Video.Poster
      : null;

  const year =
    Video?.release_date?.slice(0, 4) ||
    Video?.first_air_date?.slice(0, 4) ||
    Video?.Year ||
    "-";

  return (
    <div
      onClick={handleClick}
      className="flex cursor-pointer w-full p-[10px] flex-col overflow-hidden rounded-[10px] bg-[#262626]"
    >
      <div className="overflow-hidden w-full h-[400px]">
        {posterUrl ? (
          <img
            className="h-[385px] object-cover hover:transition-transform duration-300 hover:scale-110 w-full rounded-[10px]"
            src={posterUrl}
            alt={title}
          />
        ) : (
          <div className="flex h-[420px] items-center justify-center text-gray-400">
            No Poster
          </div>
        )}
      </div>
      <div className="mt-[15px]">
        <h3 className="title line-clamp-1">{title}</h3>
        <h4 className="r">{year}</h4>
      </div>

      {showActions ? (
        <div className="pt-3 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToWatchlist?.();
            }}
            className={`flex-1 rounded-xl px-3 py-2 font-bold transition-colors ${
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToWatched?.();
            }}
            className={`flex-1 rounded-xl px-3 py-2 font-bold transition-colors ${
              isWatched
                ? "bg-[#242424] text-white border border-white/15 hover:bg-[#2b2b2b]"
                : "bg-[#1a1a1a] hover:bg-[#222222] text-white border border-white/15"
            }`}
          >
            {isWatched ? "Already Watched" : "Add to Watched"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ResultCard;
