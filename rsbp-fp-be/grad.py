import gradio as gr
from config import *

# Fungsi untuk Rekomendasi Tempat Wisata
def place_popularity_all():
    place_popularity_all = merged_places_rating.groupby(['Place_Name']).agg(
        Rating=('Rating', 'first'),
        Total_Visits=('Place_Ratings', 'count'),
        Description=('Description', 'first'),
        City=('City', 'first'),
    ).reset_index()
    return place_popularity_all[['Place_Name', 'City', 'Rating', 'Description', 'Total_Visits']].sort_values(
        ['Rating', 'Total_Visits'], ascending=False
    )
    
# Fungsi untuk Rekomendasi Tempat Wisata
def personalized_recommendation(user_location, max_budget, min_rating, preferred_categories):
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
    return filtered_places[['Place_Name', 'City', 'Category', 'Price', 'Rating', 'Description']].sort_values('Rating', ascending=False)

# Fungsi untuk Menampilkan Tempat Wisata Terpopuler
def popular_near_you(city, age):
    if 18 <= age <= 22:
        city_places = place_popularity_youngadult[place_popularity_youngadult['City'] == city]
    elif 23 <= age <= 29:
        city_places = place_popularity_adult[place_popularity_adult['City'] == city]
    elif age >= 30:
        city_places = place_popularity_mature[place_popularity_mature['City'] == city]
    else:
        city_places = place_popularity_youngadult
    return city_places[['Place_Name', 'City', 'Rating', 'Popularity_Rank', 'Description']].sort_values(by='Popularity_Rank', ascending=True).reset_index(drop=True)

def gradio_interface():

   # Rekomendasi Semua Tempat Populer
    popular_table = gr.Interface(
        fn=place_popularity_all,
        inputs=None,
        outputs=gr.Dataframe(headers=["Place Name", "City", "Province", "Rating", "Description", "Total Visits"]),
        live=True,
        title="Wisata Terpopuler"
    )

    # Rekomendasi Wisata
    recommendation_table = gr.Interface(
        fn=personalized_recommendation,
        inputs=[
            gr.Textbox(label="Lokasi Anda (Kota)"),
            gr.Number(label="Anggaran Maksimal (Rupiah)"),
            gr.Number(label="Rating Minimal"),
            gr.CheckboxGroup(
                label="Kategori Preferensi",
                choices=["All"] + df_places['Category'].unique().tolist()
            )
        ],
        outputs=gr.Dataframe(headers=["Place Name", "City", "Category", "Price", "Rating", "Description"]),
        live=True,
        title="Rekomendasi Wisata Berdasarkan Preferensi"
    )

    # Tempat Wisata Terpopuler
    near_table = gr.Interface(
        fn=popular_near_you,
        inputs=[
            gr.Textbox(label="Kota"),
            gr.Number(label="Usia Anda")
        ],
        outputs=gr.Dataframe(headers=["Place Name","City", "Rating", "Popularity Rank", "Description"]),
        live=True,
        title="Tempat Wisata Terpopuler Berdasarkan Lokasi dan Usia"
        #orang lain jg suka ini kek gt
    )

    gr.TabbedInterface(
        [popular_table, recommendation_table, near_table],
        ["Wisata Populer", "Rekomendasi Wisata", "Wisata Populer Terdekat"]
    ).launch(share=True)

gradio_interface()