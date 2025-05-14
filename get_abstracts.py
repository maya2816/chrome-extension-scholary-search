import requests
import os
from dotenv import load_dotenv
from rank_abstracts import rank_abstracts_with_openai

# Load .env file
load_dotenv()

API_KEY = os.getenv("SEMANTIC_SCHOLAR_API_KEY")
SEARCH_QUERY = os.getenv("SEARCH_QUERY")

def get_top_10_abstracts(query):
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    headers = {
        "x-api-key": API_KEY
    }
    params = {
        "query": query,
        "limit": 30,
        "fields": "title,abstract,url"
    }

    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.text}")
        return []

    papers = response.json().get("data", [])
    valid_abstracts = []

    for paper in papers:
        title = paper.get("title", "No title")
        abstract = paper.get("abstract", "")
        url = paper.get("url", "")
        if abstract and abstract.strip():
            valid_abstracts.append({"title": title, "abstract": abstract, "url": url})
        if len(valid_abstracts) == 10:
            break

    return valid_abstracts

if __name__ == "__main__":
    query = SEARCH_QUERY
    results = get_top_10_abstracts(query)

    # Modify this list of keywords as needed
    KEYWORDS = os.getenv("KEYWORDS", "")
    keywords = [k.strip() for k in KEYWORDS.split(",") if k.strip()]

    if results:
        ranked_results = rank_abstracts_with_openai(results, keywords)

        for i, paper in enumerate(ranked_results, 1):
            print("=" * 80)
            print(f"Rank {i}: {paper['title']}")
            print(f"Score: {paper['score']}")
            print(f"URL: {paper['url']}")
            print(f"Abstract:\n{paper['abstract']}\n")
    else:
        ranked_results = []
        print("No valid abstracts found.")
