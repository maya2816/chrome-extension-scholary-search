import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def rank_papers_by_relevance(research_question, papers):
    """
    Sends a list of papers and a research question to OpenAI API.
    Returns a list of dictionaries with 'title', 'score', and 'url'.
    """
    formatted = "\n\n".join([
        f"Paper {i+1}:\n"
        f"Title: {p['title']}\n"
        f"Authors: {', '.join(p['authors'])}\n"
        f"URL: {p['url']}\n"
        f"Abstract: {p['abstract']}"
        for i, p in enumerate(papers)
    ])

    prompt = f"""Research Question: "{research_question}"

Below are abstracts of 10 research papers related to this question.
Please assign a relevance score from 0.0 to 1.0 (1.0 = highly relevant).
Return a JSON array of objects with keys "title", "score", and "url".

{formatted}
"""

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "gpt-4o",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)

    if response.status_code != 200:
        raise Exception(f"OpenAI API error: {response.status_code} - {response.text}")

    content = response.json()['choices'][0]['message']['content'].strip()

    try:
        return json.loads(content)
    except Exception as e:
        raise Exception(f"Failed to parse OpenAI response as JSON: {content}") from e
