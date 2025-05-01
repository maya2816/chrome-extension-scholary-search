const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const SS_API_KEY     = import.meta.env.SEMANTIC_SCHOLAR_API_KEY;

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'performSearch') {
    const { query, keywords } = request.searchData;
    try {
      // 1) Fetch top 10 papers from Semantic Scholar
      const ssUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=10&fields=title,abstract,url,authors`;
      const ssRes = await fetch(ssUrl, {
        headers: { 'x-api-key': SS_API_KEY }
      });
      const ssJson = await ssRes.json();
      const papers = ssJson.data.map(p => ({
        title: p.title,
        url: p.url,
        authors: p.authors?.map(a => a.name) || [],
        abstract: p.abstract
      }));

      // 2) Call OpenAI to rank them
      const formatted = papers.map((p, i) =>
        `Paper ${i + 1}:
Title: ${p.title}
Authors: ${p.authors.join(', ')}
URL: ${p.url}
Abstract: ${p.abstract}`
      ).join('\n\n');

      const prompt = `Research Question: "${query}"

Below are abstracts of 10 research papers related to this question.
Please assign a relevance score from 0.0 to 1.0 (1.0 = highly relevant). Return a JSON array of objects with keys \"title\", \"score\", and \"url\".\n\n${formatted}`;

      const oaRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
      });
      const oaJson = await oaRes.json();
      const result = JSON.parse(oaJson.choices[0].message.content.trim());

      sendResponse({ success: true, data: result });
    } catch (err) {
      console.error(err);
      sendResponse({ success: false, message: err.message });
    }
    return true;
  }
});