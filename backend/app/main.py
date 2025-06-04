import ast
import pandas as pd

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from urllib.parse import unquote


app = FastAPI()

origins = [
    "http://localhost:5174", 
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your preprocessed DataFrame
df = pd.read_csv("categories.csv")

# Parse dictionary and list columns if stored as strings
df["category_percentages"] = df["category_percentages"].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
df["cleanup_message"] = df["cleanup_message"].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)

def relevance_score_dict(cat_pct_dict, selected_categories: List[str]) -> float:
    return sum(cat_pct_dict.get(cat, 0) for cat in selected_categories)

def extract_title_from_url(url: str) -> str:
    """Extracts the article title from the Wikipedia URL."""
    return unquote(url.split("/wiki/")[-1].replace("_", " "))

@app.get("/recommendations")
def get_recommendations(categories: str = Query(..., description="Comma-separated list of interests")):
    """
    Return top article recommendations based on user-selected interests.
    """
    selected_categories = [cat.strip() for cat in categories.split(",")]

    df_copy = df.copy()
    df_copy['relevance'] = df_copy['category_percentages'].apply(
        lambda d: relevance_score_dict(d, selected_categories)
    )

    df_copy['relatedCategories'] = df_copy['category_percentages'].apply(lambda d: list(d.keys()))
    df_copy['title'] = df_copy['url'].apply(extract_title_from_url)

    recommended = df_copy[df_copy['relevance'] > 0] \
        .sort_values(by='relevance', ascending=False) \
        .head(30)

    results = [
        {
            "pageid": idx + 1,
            "title": row["title"],
            "relatedCategories": row["relatedCategories"],
            "cleanup_messages": row["cleanup_message"],
            "relevance": round(row["relevance"], 2)
        }
        for idx, row in recommended.iterrows()
    ]

    if not results:
        return {"message": "No recommendations found."}
    
    return {"recommendations": results}
