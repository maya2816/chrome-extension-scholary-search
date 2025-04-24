import requests

def get_top_10_abstracts(query):
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    params = {
        "query": "cold war in guatemala",
        "limit": 10,
        "fields": "title,abstract"
    }

    response = requests.get(url, params=params)
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
    query = "natural language processing"
    results = get_top_10_abstracts(query)

    for i, paper in enumerate(results, start=1):
        print(f"\nPaper {i}: {paper['title']}\nAbstract: {paper['abstract']}\n")
