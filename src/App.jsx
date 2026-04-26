import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Details from "./Components/Details";
import Movies from "./Components/Movies";
import TVSeries from "./Components/TVSeries";
import WatchList from "./Components/WatchList";
import Watched from "./Components/Watched";
import ScrollToTop from "./Components/ScrollToTop";
function App() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tvseries" element={<TVSeries />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/watchlist" element={<WatchList />} />
        <Route path="/watched" element={<Watched />} />
      </Routes>
    </>
  );
}

export default App;
