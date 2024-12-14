import React, { useEffect, useState } from 'react';
import apiClient from '../services/api';

const PopularPlaces = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    apiClient
      .get('/popular/places/all')
      .then((response) => {
        setPlaces(response.data);
      })
      .catch((error) => {
        console.error('Error fetching popular places:', error);
      });
  }, []);

  return (
    <div>
      <h1>Wisata Populer</h1>
      <table>
        <thead>
          <tr>
            <th>Place Name</th>
            <th>City</th>
            <th>Rating</th>
            <th>Total Visits</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {places.map((place, index) => (
            <tr key={index}>
              <td>{place.Place_Name}</td>
              <td>{place.City}</td>
              <td>{place.Rating}</td>
              <td>{place.Total_Visits}</td>
              <td>{place.Description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PopularPlaces;
