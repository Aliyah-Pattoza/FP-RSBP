import React, { useState } from "react";
import "../App.css";

const Recommendations = () => {
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("All"); 
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    // Validasi Input
    if (!city.trim()) {
      alert("Mohon masukkan lokasi Anda.");
      return;
    }
    if (!budget || isNaN(budget) || budget < 0) {
      alert("Anggaran maksimal harus berupa angka positif.");
      return;
    }
    if (!rating || isNaN(rating) || rating < 0 || rating > 5) {
      alert("Rating harus berupa angka antara 0 hingga 5.");
      return;
    }

    // Tentukan kategori
    const selectedCategories =
      category === "All" ? ['Budaya', 'Taman Hiburan', 'Cagar Alam', 'Bahari', 'Pusat Perbelanjaan', 'Tempat Ibadah'] : [category];

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/recommend/places/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_location: city,
          max_budget: parseInt(budget) || 0,
          min_rating: parseFloat(rating) || 0,
          preferred_categories: selectedCategories,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      if (!data || data.length === 0) {
        alert("Tidak ada tempat wisata yang cocok ditemukan.");
        setPlaces([]);
      } else {
        setPlaces(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Terjadi masalah saat mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Rekomendasi Wisata</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Lokasi Anda (Kota)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="number"
          placeholder="Anggaran Maksimal (Rupiah)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rating Minimal (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All</option>
          <option value="Taman Hiburan">Taman Hiburan</option>
          <option value="Cagar Alam">Cagar Alam</option>
          <option value="Budaya">Budaya</option>
          <option value="Bahari">Bahari</option>
          <option value="Pusat Perbelanjaan">Pusat Perbelanjaan</option>
          <option value="Tempat Ibadah">Tempat Ibadah</option>
        </select>
        <button type="submit">Cari</button>
      </form>

      {loading ? (
        <p>Sedang memuat data...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nama Tempat</th>
              <th>Kota</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Rating</th>
              <th>Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            {places.length > 0 ? (
              places.map((place, index) => (
                <tr key={index}>
                  <td>{place.Place_Name}</td>
                  <td>{place.City}</td>
                  <td>{place.Category}</td>
                  <td>Rp {place.Price.toLocaleString()}</td>
                  <td>{place.Rating}</td>
                  <td>{place.Description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Tidak ada data wisata ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Recommendations;
