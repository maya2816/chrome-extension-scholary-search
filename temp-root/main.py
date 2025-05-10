# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from get_abstracts import get_top_10_abstracts
from rank_abstracts import rank_abstracts_with_openai
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow Chrome extension access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["chrome-extension://your-extension-id"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    keywords: List[str]

@app.post("/rank-abstracts")
def rank_abstracts(request: QueryRequest):
    abstracts = get_top_10_abstracts(request.query)
    ranked = rank_abstracts_with_openai(abstracts, request.keywords)
    return {"results": ranked}

@app.post("/search")
def search_alias(request: QueryRequest):
    return rank_abstracts(request)

@app.get("/")
def home():
    return {"message": "ScholarSearch backend is running!"}
