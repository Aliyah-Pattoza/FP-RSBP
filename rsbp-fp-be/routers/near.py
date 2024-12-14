from fastapi import APIRouter
from pydantic import BaseModel
from config import place_popularity_youngadult, place_popularity_adult, place_popularity_mature

router = APIRouter()

# Definisikan model untuk input data
class NearRequest(BaseModel):
    city: str
    age: int

@router.post("/places/near", summary="Wisata Populer Terdekat")
def popular_near_you(request: NearRequest):
    city = request.city
    age = request.age
    
    if 18 <= age <= 22:
        city_places = place_popularity_youngadult[place_popularity_youngadult['City'] == city]
    elif 23 <= age <= 29:
        city_places = place_popularity_adult[place_popularity_adult['City'] == city]
    elif age >= 30:
        city_places = place_popularity_mature[place_popularity_mature['City'] == city]
    else:
        city_places = place_popularity_youngadult

    if city_places.empty:
        return {"message": "No places found for the given city and age group."}

    return city_places[['Place_Name', 'City', 'Rating', 'Popularity_Rank', 'Description']].sort_values(
        by='Popularity_Rank', ascending=True
    ).reset_index(drop=True).to_dict(orient="records")
