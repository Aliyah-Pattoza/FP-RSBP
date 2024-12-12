from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

# Load preprocessed data
df = pd.read_csv('dataset/data.csv')

@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    city = request.args.get('city', None)
    min_rating = float(request.args.get('min_rating', 0))
    max_price = float(request.args.get('max_price', float('inf')))

    # Filter data berdasarkan parameter
    filtered_data = df[
        (df['City'].str.contains(city, case=False)) &
        (df['Rating'] >= min_rating) &
        (df['Price'] <= max_price)
    ]

    # Konversi hasil ke JSON
    result = filtered_data[['Place_Name', 'Description', 'Category', 'Price', 'Rating', 'Time_Minutes']].to_dict(orient='records')
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)