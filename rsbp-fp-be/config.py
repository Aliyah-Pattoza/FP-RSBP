import pandas as pd             # Untuk manipulasi dan analisis data I/O dataframe (ex read dataset)
import numpy as np              # Untuk operasi numerik dan komputasi
import seaborn as sns           # Dibangun di atas plt, menyediakan visualisasi yang lebih menarik
import warnings                 # Handling peringatan yang ditampilkan
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import os

# Define the folder path where the CSV files are stored
folder_path = "dataset"

# Load the CSV files
df_user = pd.read_csv(os.path.join(folder_path, "user.csv"))
df_places = pd.read_csv(os.path.join(folder_path, "tourism_with_id.csv"))
df_rating = pd.read_csv(os.path.join(folder_path, "tourism_rating.csv"))

df_places = df_places.drop(columns=['Unnamed: 11', 'Unnamed: 12', 'Coordinate'])

# Menghapus spasi kosong yang ada di awal/akhir dari kolom yang akan di group
df_places['Category'] = df_places['Category'].str.strip()
df_places['City'] = df_places['City'].str.strip()

def categorize_age(age):
    if 18 <= age <= 22:
        return 'Young Adults (18-22)'
    elif 23 <= age <= 29:
        return 'Adults (23-29)'
    elif age >= 30:
        return 'Mature (>29)'
    else:
        return 'Other'

df_user['Age_Group'] = df_user['Age'].apply(categorize_age)

merged_rating_user = pd.merge(df_rating, df_user, on='User_Id')
merged_with_places = pd.merge(merged_rating_user, df_places[['Place_Id', 'Category']], on='Place_Id')

category_ratings = merged_with_places.groupby(['Age_Group', 'Category'])['Place_Ratings'].mean().reset_index()

# # Pivot data untuk heatmap
# heatmap_data = category_ratings.pivot(index='Age_Group', columns='Category', values='Place_Ratings')
# sns.clustermap(
#     heatmap_data,
#     cmap='coolwarm',
#     annot=True,
#     fmt=".2f",
#     linewidths=0.5,
#     cbar_kws={'label': 'Average Rating'},
#     figsize=(12, 8),
#     method='ward'
# )
# plt.title('Average Rating of Categories by Age Group')
# plt.show()

merged_places_rating = pd.merge(df_rating, df_places, on='Place_Id')
merged_places_rating.head()

filtered_places_youngadult = merged_places_rating[merged_places_rating['Category'].isin(['Taman Hiburan', 'Cagar Alam', 'Tempat Ibadah'])]
place_popularity_youngadult = filtered_places_youngadult.groupby(['City', 'Place_Name']).agg(
        Average_Rating=('Place_Ratings', 'mean'),
        Total_Visits=('Place_Ratings', 'count'),
        Average_Price=('Price', 'mean'),
        Description=('Description', 'first'),
        Rating=('Rating', 'first')
    ).reset_index()

# Normalisasi harga ke fixed range untuk menampilkan harga "0"
min_price = place_popularity_youngadult['Average_Price'].min()
max_price = place_popularity_youngadult['Average_Price'].max()
place_popularity_youngadult['Normalized_Price'] = place_popularity_youngadult['Average_Price'].apply(
    lambda x: 0.01 + ((x - min_price) / (max_price - min_price)) if max_price > min_price else 25
)
place_popularity_youngadult['Popularity_Score'] = (
    place_popularity_youngadult['Total_Visits'] + place_popularity_youngadult['Average_Rating']
)

place_popularity_youngadult['Popularity_Rank'] = place_popularity_youngadult.groupby('City')['Popularity_Score'].rank(
    ascending=False, method='dense'
)

filtered_places_adult = merged_places_rating[merged_places_rating['Category'].isin(['Taman Hiburan', 'Pusat Perbelanjaan', 'Tempat Ibadah', 'Cagar Alam'])]
place_popularity_adult = filtered_places_adult.groupby(['City', 'Place_Name']).agg(
    Average_Rating=('Place_Ratings', 'mean'),
    Total_Visits=('Place_Ratings', 'count'),
    Average_Price=('Price', 'mean'),
    Description=('Description', 'first'),
    Rating=('Rating', 'first')
).reset_index()

# Normalisasi harga ke fixed range untuk menampilkan harga "0"
min_price = place_popularity_adult['Average_Price'].min()
max_price = place_popularity_adult['Average_Price'].max()
place_popularity_adult['Normalized_Price'] = place_popularity_adult['Average_Price'].apply(
    lambda x: 0.01 + ((x - min_price) / (max_price - min_price)) if max_price > min_price else 25
)
place_popularity_adult['Popularity_Score'] = (
    place_popularity_adult['Total_Visits'] + place_popularity_adult['Average_Rating']
)

place_popularity_adult['Popularity_Rank'] = place_popularity_adult.groupby('City')['Popularity_Score'].rank(
    ascending=False, method='dense'
)

filtered_places_mature = merged_places_rating[merged_places_rating['Category'].isin(['Taman Hiburan', 'Cagar Alam', 'Budaya', 'Bahari'])]
place_popularity_mature = filtered_places_mature.groupby(['City', 'Place_Name']).agg(
    Average_Rating=('Place_Ratings', 'mean'),
    Total_Visits=('Place_Ratings', 'count'),
    Average_Price=('Price', 'mean'),
    Description=('Description', 'first'),
    Rating=('Rating', 'first')
).reset_index()

# Normalisasi harga ke fixed range untuk menampilkan harga "0"
min_price = place_popularity_mature['Average_Price'].min()
max_price = place_popularity_mature['Average_Price'].max()
place_popularity_mature['Normalized_Price'] = place_popularity_mature['Average_Price'].apply(
    lambda x: 0.01 + ((x - min_price) / (max_price - min_price)) if max_price > min_price else 25
)
place_popularity_mature['Popularity_Score'] = (
    place_popularity_mature['Total_Visits'] + place_popularity_mature['Average_Rating']
)

place_popularity_mature['Popularity_Rank'] = place_popularity_mature.groupby('City')['Popularity_Score'].rank(
    ascending=False, method='dense'
)