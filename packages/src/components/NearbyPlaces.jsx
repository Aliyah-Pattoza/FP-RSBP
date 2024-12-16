import React, { useState } from "react";
import apiClient from "../services/api";

const NearbyPlaces = () => {
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!city.trim() || !age || isNaN(age) || age <= 0) {
      alert("Masukkan kota dan usia yang valid.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/near/places/near", {
        city,
        age: parseInt(age),
      });

      setPlaces(response.data || []);
    } catch (error) {
      console.error("Error fetching nearby places:", error);
      alert("Terjadi masalah saat mengambil data.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 fw-bold">Wisata Terdekat</h1>

      {/* Form Input */}
      <form className="mb-5 shadow-sm p-4 rounded bg-light" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="city" className="form-label fw-semibold">
            Kota Anda
          </label>
          <input
            type="text"
            id="city"
            className="form-control"
            placeholder="Masukkan kota Anda"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label fw-semibold">
            Usia Anda
          </label>
          <input
            type="number"
            id="age"
            className="form-control"
            placeholder="Masukkan usia Anda"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100 fw-semibold"
          style={{
            background: "linear-gradient(90deg, #4CAF50, #0056b3)",
          }}
        >
          Cari
        </button>
      </form>

      {/* Indikator Loading */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Sedang memuat data...</p>
        </div>
      )}

      {/* Kartu Tempat Wisata */}
      {places.length > 0 && (
        <div className="row">
          {places.map((place, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{place.Place_Name}</h5>
                  <p className="card-text text-muted mb-2">
                    <i className="bi bi-geo-alt-fill"></i> {place.City}
                  </p>
                  <p className="card-text">
                    <strong>Rating:</strong> {place.Rating} / 5
                  </p>
                  <p className="card-text">
                    <strong>Ranking:</strong> #{place.Popularity_Rank}
                  </p>
                  <p className="card-text">{place.Description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pesan jika tidak ada data */}
      {!loading && places.length === 0 && (
        <p className="text-center text-muted">
          Tidak ada tempat wisata ditemukan. Coba cari lagi.
        </p>
      )}
    </div>
  );
};

export default NearbyPlaces;
