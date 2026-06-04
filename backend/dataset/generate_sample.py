import os
import requests
import pandas as pd
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="../.env")

API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = os.getenv("TMDB_BASE_URL", "https://api.themoviedb.org/3")

def fetch_popular_movies(pages=5):
    all_movies = []
    
    print(f"Fetching {pages} pages of popular movies from TMDB...")
    
    for page in range(1, pages + 1):
        url = f"{BASE_URL}/movie/popular"
        params = {
            "api_key": API_KEY,
            "language": "en-US",
            "page": page
        }
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            results = response.json().get("results", [])
            for movie in results:
                # Get more details to get keywords and cast (we'll keep it simple for the sample and just use what we have, or do a lightweight append)
                # To avoid hitting rate limits too hard, we'll just use title, overview, genre_ids
                all_movies.append({
                    "id": movie.get("id"),
                    "title": movie.get("title"),
                    "overview": movie.get("overview", ""),
                    "genre_ids": movie.get("genre_ids", []),
                    "popularity": movie.get("popularity", 0.0),
                    "vote_average": movie.get("vote_average", 0.0)
                })
        else:
            print(f"Failed to fetch page {page}: {response.status_code}")
            
    return all_movies

def fetch_genres():
    url = f"{BASE_URL}/genre/movie/list"
    params = {"api_key": API_KEY, "language": "en-US"}
    response = requests.get(url, params=params)
    
    genres_dict = {}
    if response.status_code == 200:
        genres = response.json().get("genres", [])
        for g in genres:
            genres_dict[g["id"]] = g["name"]
            
    return genres_dict

def generate_dataset():
    # Ensure dataset directory exists
    os.makedirs(os.path.dirname(__file__), exist_ok=True)
    
    movies = fetch_popular_movies(10) # 200 movies
    genres_dict = fetch_genres()
    
    # Process movies to add genre names
    for movie in movies:
        genre_names = [genres_dict.get(g_id, "") for g_id in movie["genre_ids"]]
        movie["genres"] = " ".join(genre_names)
        
        # Combine text features for TF-IDF
        # We use title, overview, and genres
        combined_features = f"{movie['title']} {movie['overview']} {movie['genres']}"
        movie["combined_features"] = combined_features.lower()
        
    df = pd.DataFrame(movies)
    
    # Drop genre_ids as we have genres text now
    df = df.drop(columns=["genre_ids"])
    
    output_path = os.path.join(os.path.dirname(__file__), "movies.csv")
    df.to_csv(output_path, index=False)
    print(f"Dataset generated at {output_path} with {len(df)} movies.")

if __name__ == "__main__":
    generate_dataset()
