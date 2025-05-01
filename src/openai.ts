export async function rankPapersByRelevance(researchQuestion: string, papers: any[]): Promise<string> {
  const response = await fetch("http://localhost:4000/api/rank", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ researchQuestion, papers })
  });

  const data = await response.json();
  return data.result;
}
