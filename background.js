// src/background.js  (or .ts if you prefer)
// (this file gets built/bundled by Vite into dist/background.js)

const OPENAI_API_KEY           = import.meta.env.VITE_OPENAI_API_KEY;
const SEMANTIC_SCHOLAR_API_KEY = import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== 'performSearch') return;

  const { query, keywords } = request.searchData;

  (async () => {
    try {
      // 1) Fetch top‐10 from Semantic Scholar
      const ssUrl = new URL('https://api.semanticscholar.org/graph/v1/paper/search');
      ssUrl.searchParams.set('query', query);
      ssUrl.searchParams.set('limit', '10');
      ssUrl.searchParams.set('fields', 'title,abstract,url,authors');

      const ssRes  = await fetch(ssUrl.toString(), {
        headers: { 'x-api-key': SEMANTIC_SCHOLAR_API_KEY }
      });
      const ssJson = await ssRes.json();
      const papers = (ssJson.data || []).map(p => ({
        title:   p.title,
        url:     p.url,
        authors: (p.authors || []).map(a => a.name),
        abstract:p.abstract
      }));

      // 2) Build prompt for OpenAI
      const formatted = papers.map((p,i) => 
        `Paper ${i+1}:
Title: ${p.title}
Authors: ${p.authors.join(', ')}
URL: ${p.url}
Abstract: ${p.abstract}`
      ).join('\n\n');

      const prompt = `Research Question: "${query}"

Below are abstracts of 10 research papers related to this question.
Please assign a relevance score from 0.0 to 1.0 (1.0 = highly relevant).
Return a JSON array of objects with keys "title", "score", and "url".

${formatted}`;

      // 3) Call OpenAI
      const oaRes  = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type':  'application/json'
        },
        body: JSON.stringify({
          model:       'gpt-4o',
          messages:   [{ role: 'user', content: prompt }],
          temperature:0.3
        })
      });
      const oaJson = await oaRes.json();
      const text   = oaJson.choices[0].message.content.trim();
      const result = JSON.parse(text);

      sendResponse({ success: true, data: result });
    } catch (err) {
      console.error(err);
      sendResponse({ success: false, message: err.message });
    }
  })();

  // keep the message channel open for our async response
  return true;
});
