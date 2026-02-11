from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import csv

app = FastAPI()

app.mount('../frontend/',StaticFiles(directory='/frontend'),name="static")


@app.get('/',response_class=FileResponse)
def homepage():
    return FileResponse('frontend/login.html')