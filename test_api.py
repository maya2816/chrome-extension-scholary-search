from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "hello"}

@app.post("/echo")
def echo(data: dict):
    return data
