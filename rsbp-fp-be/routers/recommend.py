from fastapi import APIRouter
from config import df_places

router = APIRouter()

@router.post("/places/recommend", summary="Rekomendasi Tempat Wisata")
def personalized_recommendation(user_location: str, max_budget: int, min_rating: float, preferred_categories: list):
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
    return filtered_places[['Place_Name', 'City', 'Category', 'Price', 'Rating', 'Description']].sort_values('Rating', ascending=False).to_dict(orient="records")
