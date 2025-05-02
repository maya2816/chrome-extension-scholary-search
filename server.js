// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 1) Semantic Scholar endpoint
app.post("/api/search", async (req, res) => {
  const { query, keywords } = req.body;
  try {
    const url = new URL("https://api.semanticscholar.org/graph/v1/paper/search");
    url.searchParams.set("query", query + (keywords ? " " + keywords : ""));
    url.searchParams.set("limit", "10");
    url.searchParams.set("fields", "title,abstract,url");

    const response = await fetch(url.toString(), {
      headers: { "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY }
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${await response.text()}`);
    }
    const data = await response.json();
    // strip down to the bits we need
    const papers = data.data.map(p => ({
      title: p.title,
      abstract: p.abstract,
      url: p.url
    }));
    res.json({ papers });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2) OpenAI ranking endpoint
app.post("/api/rank", async (req, res) => {
  const { researchQuestion, papers } = req.body;

  // build prompt asking for JSON output
  const prompt = `
Research Question: "${researchQuestion}"

Below are abstracts of 10 research papers related to this question.
Please assign a relevance score from 0.0 to 1.0 (1.0 = highly relevant, 0.0 = not relevant) to each paper.
Return your answer as a JSON array of objects, each with keys:
  title (string),
  score (number),
  url (string).

Papers:
${papers.map((p,i) => `  ${i+1}. Title: ${p.title}
     Abstract: ${p.abstract}
     URL: ${p.url}`).join("\n\n")}
`;

  try {
    const ai = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      })
    });
    const { choices } = await ai.json();
    // parse JSON from the model response
    const text = choices[0].message.content.trim();
    let result = [];
    try { result = JSON.parse(text); }
    catch (e) { console.error("Failed to parse JSON:", text); }
    res.json({ ranked: result });
  } catch (err) {
    console.error("Rank error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
