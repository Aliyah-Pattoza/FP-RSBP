import React, { useState } from 'react';
import apiClient from '../services/api';

const NearbyPlaces = () => {
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!city.trim()) {
      alert('Mohon masukkan kota Anda.');
      return;
    }
    if (!age || isNaN(age) || age <= 0) {
      alert('Usia harus berupa angka positif.');
      return;
    }

    setLoading(true);
    try {
      // Mengirim request POST ke endpoint
      const response = await apiClient.post('/near/places/near', {
        city,
        age: parseInt(age),
      });

      // Menyimpan data yang diterima
      if (response.data && response.data.length > 0) {
        setPlaces(response.data);
      } else {
        alert('Tidak ada tempat wisata terdekat ditemukan.');
        setPlaces([]);
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      alert('Terjadi masalah saat mengambil data dari server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Wisata Terdekat</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Kota Anda"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Usia Anda"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <button type="submit">Cari</button>
      </form>

      {loading ? (
        <p>Sedang memuat data...</p>
      ) : (
        places.length > 0 && (
          <table>
            <thead>
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
        )
      )}
    </div>
  );
};

export default NearbyPlaces;
