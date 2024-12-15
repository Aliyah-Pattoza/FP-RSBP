import React, { useState } from 'react';
import apiClient from '../services/api';

const NearbyPlaces = () => {
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!city.trim() || !age || isNaN(age) || age <= 0) {
      alert('Masukkan kota dan usia yang valid.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/near/places/near', {
        city,
        age: parseInt(age),
      });

      setPlaces(response.data || []);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      alert('Terjadi masalah saat mengambil data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Wisata Terdekat</h1>

      {/* Form Input */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">Kota Anda</label>
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
          <label htmlFor="age" className="form-label">Usia Anda</label>
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
        <button type="submit" className="btn btn-primary w-100">Cari</button>
      </form>

      {/* Indikator Loading */}
      {loading && <div className="text-center mb-4">Sedang memuat data...</div>}

      {/* Tabel Hasil */}
      {places.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Nama Tempat</th>
                <th>Kota</th>
                <th>Rating</th>
                <th>Ranking Popularitas</th>
                <th>Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place, index) => (
                <tr key={index}>
                  <td>{place.Place_Name}</td>
                  <td>{place.City}</td>
                  <td>{place.Rating}</td>
                  <td>{place.Popularity_Rank}</td>
                  <td>{place.Description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pesan jika tidak ada data */}
      {!loading && places.length === 0 && (
        <p className="text-center">Tidak ada tempat wisata ditemukan. Coba cari lagi.</p>
      )}
    </div>
  );
};

export default NearbyPlaces;
