# 📚 ScholarSearch – Streamlining Research with AI

ScholarSearch is a Chrome extension designed to accelerate and enhance academic research. It uses artificial intelligence to fetch, summarize, and semantically rank scholarly articles based on user queries and keywords—all in your browser sidebar.

---

## 🚀 Features

- **🔎 Dual-Input Search:** Enter both a research query and relevant keywords to retrieve highly relevant academic papers.
- **📖 Semantic Summarization:** Summarizes long abstracts into 4-5 concise, meaningful sentences using OpenAI's GPT-3.5.
- **⚖️ AI Relevance Ranking:** Abstracts are scored by relevance using GPT-3.5 and ordered accordingly.
- **📚 Real-time Academic Integration:** Fetches up-to-date papers from the Semantic Scholar API.
- **🧩 Chrome-Native UI:** Results are shown directly in a side panel for quick reference while browsing.

---

## 🧠 How It Works

1. **User Input:** The user types a research query and a comma-separated list of keywords.
2. **Data Fetching:** ScholarSearch sends this to a FastAPI backend hosted on Render.
3. **Paper Retrieval:** The backend queries the Semantic Scholar API for relevant papers.
4. **Summarization:** Abstracts are summarized with OpenAI’s GPT-3.5 Turbo.
5. **Relevance Scoring:** Summarized abstracts are scored by relevance to the user's query.
6. **Ranking & Display:** Results are sorted, formatted, and returned to the Chrome extension UI.

---

## 🛠️ Technologies Used

| Layer       | Technology              |
|-------------|--------------------------|
| Frontend    | HTML/CSS, JavaScript     |
| Extension   | Chrome Extension (Manifest v3) |
| Backend     | Python, FastAPI, Render  |
| APIs        | Semantic Scholar, OpenAI GPT-3.5 Turbo |
| Hosting     | Render                   |

---

## 💡 Design Principles

- **Fast & Frictionless:** Designed for researchers who want fast, ranked access to papers without leaving their browser.
- **Modular Architecture:** Separates backend logic (API calls and AI ranking) from frontend (extension UI).
- **Clean UX:** Results are collapsible, clickable, and easy to digest.

---

## 🧪 Development Challenges

- **Prompt Engineering:** Fine-tuning prompts to avoid meta-language in summaries.
- **Rate Limits:** Working within OpenAI and Semantic Scholar API rate limits.
- **Version Control:** Learned to enforce clearer Git branching and commit hygiene.
- **API Chaining:** Coordinating multi-step queries without delaying the UI.

---

## 📦 Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/maya2816/chrome-extension-scholary-search.git
   ```
2. Go to `chrome://extensions` in your browser.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select the extension directory.

---

## 👥 Contributors

- Maya Kfir  
- Leyla Theunissen  
- Andrew Wong  
- Angelina Wong  
