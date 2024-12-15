import React, { useEffect, useState } from 'react';
import apiClient from '../services/api';

const PopularPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [searchCity, setSearchCity] = useState(''); // State untuk pencarian kota

  useEffect(() => {
    const fetchPopularPlaces = async () => {
      try {
        const response = await apiClient.get('/popular/places/all');
        setPlaces(response.data || []);
      } catch (error) {
        console.error('Error fetching popular places:', error);
      }
    };

    fetchPopularPlaces();
  }, []);

  // Fungsi untuk menentukan gambar default berdasarkan kategori
  const getDefaultImage = (category) => {
    switch (category) {
      case 'Taman Hiburan':
        return '/img/Taman Hiburan.jpg';
      case 'Cagar Alam':
        return '/img/Cagar Alam.jpg';
      case 'Tempat Ibadah':
        return '/img/Tempat Ibadah.jpeg';
      case 'Budaya':
        return '/img/Budaya.jpg';
      case 'Bahari':
        return '/img/Bahari.jpg';
      case 'Pusat Perbelanjaan':
        return '/img/Pusat Perbelanjaan.jpg';
      default:
        return '/img/Idn.jpg';
    }
  };

  // Filter data tempat berdasarkan kota
  const filteredPlaces = places.filter((place) =>
    place.City.toLowerCase().includes(searchCity.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Wisata Populer</h1>

      {/* Input untuk pencarian */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Cari berdasarkan kota..."
        value={searchCity}
        onChange={(e) => setSearchCity(e.target.value)}
      />

      {filteredPlaces.length > 0 ? (
        <div className="row">
          {filteredPlaces.map((place, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card h-100">
                {/* Gambar berdasarkan URL atau default per kategori */}
                {place.Image_URL ? (
                  <img
                    src={place.Image_URL}
                    alt={place.Place_Name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={getDefaultImage(place.Category)}
                    alt={`Default for ${place.Category}`}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}

                <div className="card-body">
                  <h5 className="card-title">{place.Place_Name}</h5>
                  <p className="card-text">{place.Description}</p>
                  <p>
                    <strong>Kota:</strong> {place.City}
                  </p>
                  <p>
                    <strong>Rating:</strong> {place.Rating}
                  </p>
                  <p>
                    <strong>Kategori:</strong> {place.Category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">Tidak ada tempat wisata untuk kota tersebut.</p>
      )}
    </div>
  );
};

export default PopularPlaces;
