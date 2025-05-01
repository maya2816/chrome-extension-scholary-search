import requests
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Get API key and search query from environment
API_KEY = os.getenv("SEMANTIC_SCHOLAR_API_KEY")
SEARCH_QUERY = os.getenv("SEARCH_QUERY")

def get_top_10_abstracts(query):
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    headers = {
        "x-api-key": API_KEY
    }
    params = {
        "query": query,
        "limit": 10,
        "fields": "title,abstract"
    }

    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.text}")
        return []

    papers = response.json().get("data", [])
    abstracts = []

    for i, paper in enumerate(papers, start=1):
        title = paper.get("title", "No title")
        abstract = paper.get("abstract", "No abstract available")
        abstracts.append({"title": title, "abstract": abstract})

    return abstracts

# Example usage
import json

if __name__ == "__main__":
    query = SEARCH_QUERY
    results = get_top_10_abstracts(query)
    print(json.dumps(results)) 
