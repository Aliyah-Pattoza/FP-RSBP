from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from config import df_places

router = APIRouter()

class RecommendRequest(BaseModel):
    user_location: str
    max_budget: int
    min_rating: float
    preferred_categories: List[str]

@router.post("/places/recommend", summary="Rekomendasi Tempat Wisata")
def personalized_recommendation(request: RecommendRequest):
    user_location = request.user_location
    max_budget = request.max_budget
    min_rating = request.min_rating
    preferred_categories = request.preferred_categories

    # Filter data berdasarkan input
    if "All" in preferred_categories:
        filtered_places = df_places[
            (df_places['City'] == user_location) &
            (df_places['Price'] <= max_budget) &
            (df_places['Rating'] >= min_rating)
        ]
    else:
        filtered_places = df_places[
            (df_places['City'] == user_location) &
            (df_places['Price'] <= max_budget) &
            (df_places['Rating'] >= min_rating) &
            (df_places['Category'].isin(preferred_categories))
        ]

    if filtered_places.empty:
        return {"message": "No places found matching the criteria."}

    # Return data yang sudah difilter dan diurutkan
    return filtered_places[['Place_Name', 'City', 'Category', 'Price', 'Rating', 'Description']].sort_values(
        'Rating', ascending=False
    ).to_dict(orient="records")
