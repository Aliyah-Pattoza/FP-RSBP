import React, { useState } from "react";
import PopularPlaces from "./components/PopularPlaces";
import Recommendations from "./components/Recommendations";
import NearbyPlaces from "./components/NearbyPlaces";

function App() {
  const [activePage, setActivePage] = useState("popular");

  const renderPage = () => {
    if (activePage === "popular") return <PopularPlaces />;
    if (activePage === "recommendations") return <Recommendations />;
    if (activePage === "nearby") return <NearbyPlaces />;
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <a href="#" className="navbar-brand">
          Tourism Recommendations
        </a>
        <div className="navbar-menu">
          <button
            className={activePage === "popular" ? "active" : ""}
            onClick={() => setActivePage("popular")}
          >
            Wisata Populer
          </button>
          <button
            className={activePage === "recommendations" ? "active" : ""}
            onClick={() => setActivePage("recommendations")}
          >
            Rekomendasi
          </button>
          <button
            className={activePage === "nearby" ? "active" : ""}
            onClick={() => setActivePage("nearby")}
          >
            Wisata Terdekat
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-4">{renderPage()}</div>

    </div>
  );
}

export default App;
