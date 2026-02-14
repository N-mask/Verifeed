from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from post_handler import *
from login_handler import *
from uuid import uuid4

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RateRequest(BaseModel):
    user: str
    title: str
    score: int
    
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class PostRequest(BaseModel):
    title: str
    content: str
    user: str 
@app.get('/')
async def landing():
    return FileResponse('demo.html')

@app.post('/rate')
async def ratePostM(rate: RateRequest):
    new_avg = await ratePost(rate.user, rate.title, rate.score)
    return {"success": True, "new_average": new_avg}

@app.post('/login')
async def loginM(creds: LoginRequest):
    logged = await login(creds.email, creds.password)
    
    if logged:
        username = await getUserName(creds.email)
        return {
            "token": str(uuid4()),
            "user": {
                "email": creds.email,
                "username": username
            }
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid creds")

@app.post('/register')
async def registerM(creds: RegisterRequest):
    reg = await register(creds.username, creds.password, creds.email, 0)
    if reg:
        return { "message": "User registered successfully" }
    else:
        raise HTTPException(status_code=400, detail="User already exists")

@app.get('/posts')
async def getPostsM():
    posts = await getPosts()
    return posts

@app.post('/rate')
async def ratePostM(rate: RateRequest):
    new_avg = await ratePost(rate.user, rate.title, rate.score)
    return {"success": True, "new_average": new_avg}

@app.post('/posts')
async def createPostM(post: PostRequest):
    await postNew(post.title, 5.0, post.user, post.content)
    return {"success": True}
@app.get('/getusers')
async def getUsersM():
    users = await getUsers()
    return users
