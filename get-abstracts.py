import requests

API_KEY = "ADD API KEY HERE"

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
if __name__ == "__main__":
    query = "cold war in guatemala"
    results = get_top_10_abstracts(query)

    for i, paper in enumerate(results, start=1):
        print(f"\nPaper {i}: {paper['title']}\nAbstract: {paper['abstract']}\n")
