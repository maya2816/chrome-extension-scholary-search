from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def rank_abstracts_with_openai(abstracts, keywords):
    prompt = (
        "You are a research assistant. Given a set of abstracts and keywords, "
        "rank the abstracts from most to least relevant based on how closely they relate to the keywords.\n\n"
        f"Keywords: {', '.join(keywords)}\n\n"
        "Here are the abstracts:\n"
    )

    for i, paper in enumerate(abstracts, 1):
        prompt += f"{i}. {paper['title']}\n{paper['abstract']}\n\n"

    prompt += "Return a list of abstract numbers in ranked order of relevance as a JSON array."

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    content = response.choices[0].message.content
    try:
        ranked_indices = eval(content)  # Expected format: [3, 1, 2, ...]
        return [abstracts[i - 1] for i in ranked_indices]
    except Exception as e:
        print("Failed to parse OpenAI response:", content)
        return abstracts
