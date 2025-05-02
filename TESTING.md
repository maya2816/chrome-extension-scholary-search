# TESTING.md

## Overview

Testing for this project was conducted manually due to the nature of Chrome Extension development and the integration of external APIs like Semantic Scholar and OpenAI. We focused on verifying user interface interactions, backend communication, and the correctness of AI-generated results.

---

## 1. Interface Testing

**Approach**: Manual walkthroughs performed in the Chrome Extension popup and side panel. 

**Environment**:
- Google Chrome v123+
- Local extension built using `vite build` and loaded via `dist/manifest.json`
- Test environment API keys in `.env`

### Test Case 1: Basic UI Load
- **Input**: Load the extension and click on the icon
- **Expected Output**: ScholarSearch panel appears with fields for Research Query and Keywords
- **Result**: ✅ Pass — UI renders correctly, fonts and buttons load as expected

### Test Case 2: Search Flow
- **Input**: Type a query and keywords, click "Find Papers"
- **Expected Output**: Loading animation appears, followed by a ranked list of paper titles with scores
- **Result**: ✅ Pass — Button triggers background message; results appear in panel

### Test Case 3: Empty Input
- **Input**: Leave fields blank and click "Find Papers"
- **Expected Output**: No action or an error message
- **Result**: ⚠️ Needs Improvement — Currently sends request with empty query; consider input validation

---

## 2. Prompt Testing

**Approach**: Manual tests using actual responses from the OpenAI API.

**Model Used**: `gpt-4o` via `https://api.openai.com/v1/chat/completions`

### Prompt Format Used
```plaintext
Research Question: "..."
Below are abstracts of 10 research papers...
Please assign a relevance score from 0.0 to 1.0...
Return a JSON array of objects with keys "title", "score", and "url".
