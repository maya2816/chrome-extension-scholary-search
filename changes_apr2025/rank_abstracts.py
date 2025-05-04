<<<<<<< Updated upstream
=======
import re
import json
from openai import OpenAI
>>>>>>> Stashed changes
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

print("✅ rank_abstracts_with_openai is available")

def rank_abstracts_with_openai(abstracts, keywords):
    prompt = (
<<<<<<< Updated upstream
        "You are a research assistant. Given a list of paper abstracts and a set of keywords, "
        "rank the abstracts from most to least relevant to the keywords. "
        "Return ONLY a JSON array of numbers representing the ranked abstract indices.\n\n"
=======
        "You are a research assistant. Given a list of abstracts and a set of keywords, "
        "evaluate how relevant each abstract is to the keywords. "
        "Assign a relevance score from 1 to 100 (higher = more relevant) to each abstract. "
        "Return a JSON array sorted from highest to lowest score, where each object includes:\n"
        "- 'title'\n"
        "- 'abstract'\n"
        "- 'url'\n"
        "- 'score'\n\n"
>>>>>>> Stashed changes
        f"Keywords: {', '.join(keywords)}\n\n"
        "Abstracts:\n"
    )

    for i, paper in enumerate(abstracts, 1):
        prompt += (
            f"{i}. Title: {paper['title']}\n"
            f"Abstract: {paper['abstract']}\n"
            f"URL: {paper['url']}\n\n"
        )

    prompt += (
<<<<<<< Updated upstream
        "\nReturn the ranked order as a JSON array of numbers, like this: [3, 1, 2, ...]. "
        "Do not include any explanation or notes—just the array."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )

        content = response.choices[0].message.content.strip()

        # Try to parse as JSON
        ranked_indices = json.loads(content)

        # Ensure it's a list of numbers
        if isinstance(ranked_indices, list) and all(isinstance(i, int) for i in ranked_indices):
            return [abstracts[i - 1] for i in ranked_indices if 1 <= i <= len(abstracts)]

    except Exception as e:
        print("⚠️ OpenAI Ranking Failed:", e)
        print("Response content:\n", content)

    # Fallback: return in original order
    return abstracts
=======
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
>>>>>>> Stashed changes
