import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

class MovieRecommender:
    def __init__(self, data_path="dataset/movies.csv"):
        self.data_path = data_path
        self.df = None
        self.cosine_sim = None
        self.load_data()

    def load_data(self):
        full_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), self.data_path)
        if not os.path.exists(full_path):
            print(f"Dataset not found at {full_path}. Run generate_sample.py first.")
            return

        self.df = pd.read_csv(full_path)
        
        # Ensure combined_features has no NaN
        self.df['combined_features'] = self.df['combined_features'].fillna('')
        
        # Compute TF-IDF
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(self.df['combined_features'])
        
        # Compute cosine similarity
        self.cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    def get_recommendations_by_title(self, title, top_n=6):
        if self.df is None or self.cosine_sim is None:
            return []
            
        # Try to find an exact or partial match for the title
        match = self.df[self.df['title'].str.contains(title, case=False, na=False)]
        
        if match.empty:
            return []
            
        idx = match.index[0]
        
        # Get pairwise similarity scores
        sim_scores = list(enumerate(self.cosine_sim[idx]))
        
        # Sort movies based on similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Get top N similar movies (excluding itself)
        sim_scores = sim_scores[1:top_n+1]
        
        movie_indices = [i[0] for i in sim_scores]
        
        # Return TMDB IDs and basic metadata
        recommendations = self.df.iloc[movie_indices][['id', 'title', 'popularity', 'vote_average']].to_dict('records')
        return recommendations
        
    def get_recommendations_by_text(self, text, top_n=6):
        """Recommend based on an arbitrary text prompt (e.g., AI route)"""
        if self.df is None:
            return []
            
        # We need to transform the input text and calculate similarity against all movies
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(self.df['combined_features'])
        
        # Transform the prompt using the same vocabulary
        text_vector = tfidf.transform([text.lower()])
        
        # Calculate similarity between prompt and all movies
        sim_scores = cosine_similarity(text_vector, tfidf_matrix).flatten()
        
        # Get top N indices
        movie_indices = sim_scores.argsort()[-top_n:][::-1]
        
        recommendations = self.df.iloc[movie_indices][['id', 'title', 'popularity', 'vote_average']].to_dict('records')
        return recommendations

# Create a singleton instance to be used by the API
recommender = MovieRecommender()
