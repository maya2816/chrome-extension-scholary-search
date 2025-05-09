import re
import json
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_abstract(abstract):
    """Summarize a single abstract using GPT"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "user",
                "content": f"Summarize the following abstract in 2-3 concise sentences:\n\n{abstract}"
            }],
            temperature=0.5
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print("❌ Error summarizing abstract:", e)
        return abstract[:300] + "..."  # fallback: truncate

def rank_abstracts_with_openai(abstracts, keywords):
    """Summarize abstracts first, then rank them by relevance to keywords"""
    summarized = []

    for paper in abstracts:
        summary = summarize_abstract(paper["abstract"])
        summarized.append({
            "title": paper["title"],
            "abstract": summary,
            "url": paper["url"]
        })
    
    prompt = (
        "You are a research assistant. Given a list of summarized abstracts and a set of keywords, "
        "evaluate how relevant each abstract is to the keywords. "
        "Assign a relevance score from 1 to 100 (higher = more relevant) to each abstract. "
        "Return a JSON array sorted from highest to lowest score, where each object includes:\n"
        "- 'title'\n"
        "- 'abstract'\n"
        "- 'url' (exactly as provided — do not change or fabricate it)\n\n"
        "- 'score'\n\n"
        f"Keywords: {', '.join(keywords)}\n\n"
        "Here are the abstracts. Use the given URLs as-is:\n"
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

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        content = response.choices[0].message.content.strip()

        if content.startswith("```json"):
            content = content[len("```json"):].strip()
        if content.endswith("```"):
            content = content[:-3].strip()

        return json.loads(content)
    except Exception as e:
        print("❌ Ranking failed:", e)
        return []