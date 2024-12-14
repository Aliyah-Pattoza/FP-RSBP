from fastapi import APIRouter
from config import merged_places_rating

router = APIRouter()

@router.get("/places/all", summary="Wisata Terpopuler")
def place_popularity_all():
    place_popularity_all = merged_places_rating.groupby(['Place_Name']).agg(
        Rating=('Rating', 'first'),
        Total_Visits=('Place_Ratings', 'count'),
        Description=('Description', 'first'),
        City=('City', 'first'),
    ).reset_index()
    return place_popularity_all[['Place_Name', 'City', 'Rating', 'Description', 'Total_Visits']].sort_values(
        ['Rating', 'Total_Visits'], ascending=False
    ).to_dict(orient="records")
