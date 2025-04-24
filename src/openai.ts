// src/utils/openai.ts
export async function rankPapersByRelevance(researchQuestion: string, papers: any[]): Promise<string> {
    const formattedPapers = papers.map((paper, index) => {
      const authors = paper.authors?.join(", ") || "Unknown authors";
      return `Paper ${index + 1}:
  Title: ${paper.title}
  Authors: ${authors}
  URL: ${paper.url}
  Abstract: ${paper.abstract}`;
    }).join("\n\n");
  
    const prompt = `
  Research Question: "${researchQuestion}"
  
    Below are abstracts of 10 research papers related to this question.

    Please assign a relevance score **from 0.0 to 1.0** (1.0 = highly relevant, 0.0 = not relevant) to each paper, based on how closely the abstract addresses the research question.
  
  ${formattedPapers}

  Return the result as a list where each entry is information about an article:
  - Title
  - Score: X/1.0
  - Authors
  - URL
  - Abstract 
`;
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // or insert key manually if needed
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o", // or gpt-4o-mini
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      })
    });
  
    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
  