import React, { useState } from 'react';
import apiClient from '../services/api';

const NearbyPlaces = () => {
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [places, setPlaces] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    apiClient
      .post('/near/places/near', { city, age: parseInt(age) })
      .then((response) => {
        setPlaces(response.data);
      })
      .catch((error) => {
        console.error('Error fetching nearby places:', error);
      });
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

      {places.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Place Name</th>
              <th>City</th>
              <th>Rating</th>
              <th>Popularity Rank</th>
              <th>Description</th>
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
      )}
    </div>
  );
};

export default NearbyPlaces;
