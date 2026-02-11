from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import csv

app = FastAPI()

app.mount('/root/',StaticFiles(directory='frontend'),name="static")


@app.get('/')
def homepage():
    return FileResponse('frontend/index.html')

@app.get('/login/')
def login():
    return FileResponse('frontend/login.html')