## Chrome Extension: Google Scholar Article Search (based on keywords and relevance of abstract)

### Authors

Andrew Wong, Angelina Wong, Maya Kfir, Leyla Theunissen

### Problem Statement

Finding relevant information for a research paper takes a long time, since it involves trying to find relevant academic articles by digging through the abstracts to identify pertinent papers.

Our Chrome extension aims to solve this problem by streamlining the process of discovering new, relevant articles based on user-specified topics and keywords. When users input a topic or keywords, it searches Google Scholar (or uses cached search results), identifies recently published articles, extracts abstracts using Semantic Scholar API, and uses an LLM to determine which are most relevant.

### Target Audience

Our extension targets researchers, academics, students and any person who needs to find and review reliable and relevant academic articles for their project. Main audience characteristics include:
* Basic familiarity with academic research sources
* Demand for efficient way to find relevant articles

### Description

Our Chrome extension streamlines the process of discovering relevant academic articles, empowering researchers to efficiently find high-quality content tailored to their needs. Users can input a search query or list of keywords to fetch recent Google Scholar results, summarize abstracts, and assess their relevance using a large language model (LLM).

For instance, a researcher exploring "Explainable AI in Medical Imaging for Rare Genetic Disorders" within a specific time frame can use the extension to identify the most pertinent articles from Google Scholar. The tool extracts abstracts, summarizes their content, and ranks the articles based on their relevance to the query.

By combining summarization with semantic relevance scoring, the extension simplifies the research process, allowing users to focus on high-value content. Summaries and relevance indicators are displayed in a clean, intuitive interface with optional features such as exporting summaries to CSV/Markdown or receiving weekly updates on new publications.

Core features of are extension, include:
* Input a search query or keyword list.
* Automatically fetches a set number of recent results from Google Scholar (e.g., published in the past 6–12 months).
* For each abstract, run LLM summarization and relevance scoring (e.g., "How related is this paper to X?").
* Ranks and displays the top-N most relevant papers with summaries.

This project aligns with the semester’s theme of accelerating the extraction of input data for LLM prompt generation. It reduces the overwhelming volume of academic literature into concise, contextually relevant insights, enabling faster and smarter use of LLMs for literature reviews, prompt generation, and research synthesis.

### Selling Points
1. Speeds up research by instantly surfacing high-relevance articles based on AI-powered analysis.
2. Reduces cognitive load by summarizing each abstract into key points.
3. Surfaces what's meaningful, not just what's most cited—helpful for interdisciplinary or emerging fields.
4. Integrates smoothly into existing research habits via browser, export options, and topic tracking.
5. Adapts to users by learning from their preferences (e.g., marking papers as relevant or irrelevant).

## USER STORIES

1. As a student, I want to enter a few keywords and get relevant article summaries, so I can start my paper faster.
2. As a researcher, I want to view a ranked list of articles with high relevance scores, so I can focus only on the most useful ones.
3. As a busy academic, I want to skim LLM-generated summaries, so I don’t have to read full abstracts for every paper.
4. As a user, I want to filter results by a custom date range, so I can find the most recent research in my field.
5. As a PhD candidate, I want to export the summaries and citations into a CSV file, so I can add them to my research log.
6. As a user, I want to click a direct link to the full article or PDF, so I can immediately start reading if needed.
7. As a grad student, I want to save key articles with personal notes, so I can remember why they were useful.
8. As a curious reader, I want the tool to check for newly published articles on a topic weekly, so I can stay up to date.
9. As a user, I want to set how many articles are fetched, so I can scale the results depending on my time and needs.
10. As a user, I want to give feedback (relevant / not relevant) on each summary, so the tool can improve its future recommendations.
11. As a user, I want a progress/loading bar while results are being generated, so I know the extension is working.
12. As a research assistant, I want to compare summaries of papers across multiple queries, so I can fine-tune my literature review.
13. As a user, I want to copy and paste summaries with citation info easily, so I can integrate them into my notes or Zotero.
14. As a user, I want to tag or categorize articles into folders, so I can organize my findings by subtopic.
15. As a user, I want the extension to cache results for my past queries, so I can revisit them without re-running the search.

