// src/utils/openai.ts
export interface Paper {
  title: string;
  url: string;
  authors: string[];
  abstract: string;
}

export interface RankedPaper {
  title: string;
  score: number;
  url: string;
}

/**
 * Sends the list of papers and research question to OpenAI
 * and returns a parsed JSON array of { title, score, url }.
 */
export async function rankPapersByRelevance(
  researchQuestion: string,
  papers: Paper[]
): Promise<RankedPaper[]> {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  const formatted = papers
    .map(
      (p, i) =>
        `Paper ${i + 1}:
Title: ${p.title}
Authors: ${p.authors.join(", ")}
URL: ${p.url}
Abstract: ${p.abstract}`
    )
    .join("\n\n");

  const prompt = `Research Question: "${researchQuestion}"

Below are abstracts of 10 research papers related to this question.
Please assign a relevance score from 0.0 to 1.0 (1.0 = highly relevant).
Return a JSON array of objects with keys "title", "score", and "url".

${formatted}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content.trim();

  try {
    return JSON.parse(content) as RankedPaper[];
  } catch (err) {
    console.error("OpenAI response parse error:", content);
    throw new Error("Failed to parse OpenAI response as JSON.");
  }
}