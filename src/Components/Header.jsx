import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo-trans.png";
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Tv Series", path: "/tvseries" },
    { name: "Watchlist", path: "/watchlist" },
    { name: "Watched", path: "/watched" },
  ];

  return (
    <header
      className={`  element-center h-[90px] fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
        scrolled ? "bg-[#393939] shadow-md" : "bg-[#1f1f1f]/90 backdrop-blur-sm"
      }`}
    >
      {/* logo */}
      <div className="container mx-auto flex items-center justify-between p-4 md:p-6">
        <Link to="/" className="shrink-0">
          <img
            className="h-[50px] w-auto md:h-[55px]  object-contain"
            src={logo}
            alt="MovieX"
          />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden  md:flex gap-8 font-bold text-[#cac9c9]">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="transition-colors duration-200 hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden text-white transition-all duration-700 ease-in-out focus:outline-none"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-expanded={mobileMenu}
          aria-label={mobileMenu ? "Close menu" : "Open menu"}
        >
          {mobileMenu ? (
            <span className="text-2xl" aria-hidden>
              ✖
            </span>
          ) : (
            <span className="text-2xl" aria-hidden>
              ☰
            </span>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <nav className=" mt-[150px] mr-[20px] md:hidden bg-[#393939] text-[#cac9c9] font-bold flex flex-col gap-3 p-4">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="transition-colors duration-200 hover:text-white"
              onClick={() => setMobileMenu(false)} // close menu on click
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Header;
