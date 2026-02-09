from fastapi import *
from fastapi.responses import HTMLResponse

app = FastAPI()

@app.get('/',response_class=HTMLResponse)
def homepage():
    ...