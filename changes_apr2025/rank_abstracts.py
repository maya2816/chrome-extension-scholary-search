import re
import json
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def rank_abstracts_with_openai(abstracts, keywords):
    prompt = (
        "You are a research assistant. Given a list of abstracts and a set of keywords, "
        "evaluate how relevant each abstract is to the keywords. "
        "Assign a relevance score from 1 to 100 (higher = more relevant) to each abstract. "
        "Return a JSON array sorted from highest to lowest score, where each object includes:\n"
        "- 'title'\n"
        "- 'abstract'\n"
        "- 'url'\n"
        "- 'score'\n\n"
        f"Keywords: {', '.join(keywords)}\n\n"
        "Here are the abstracts:\n"
    )

    for i, paper in enumerate(abstracts, 1):
        prompt += (
            f"{i}. Title: {paper['title']}\n"
            f"Abstract: {paper['abstract']}\n"
            f"URL: {paper['url']}\n\n"
        )

    prompt += (
        "Only return a pure JSON array. Do not include any commentary or explanation."
    )

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    content = response.choices[0].message.content.strip()

    # Remove markdown-style code fencing
    if content.startswith("```json"):
        content = content[len("```json"):].strip()
    if content.endswith("```"):
        content = content[:-3].strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        print("Failed to parse OpenAI response as JSON:\n", content)
        return []