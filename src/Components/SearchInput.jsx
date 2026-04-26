import searchimg from "../assets/search.png";
function SearchInput({ searchValue, setSearchValue }) {
  return (
    <div>
      <div className="relative ">
        <img
          src={searchimg}
          alt="search.png"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white"
        />

        <input
          className=" w-[300px] md:w-[550px] h-[60px] bg-[#262626] px-[50px] py-[10px]  rounded-xl "
          type="text"
          placeholder="Search movies or tv shows"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SearchInput;
