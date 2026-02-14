from fastapi import FastAPI,HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from post_handler import *
from login_handler import *
from uuid import uuid4

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
async def landing():
    return FileResponse('demo.html')

@app.post('/login')
async def loginM(email:str,password:str):
    logged = await login(email,password)
    print(logged)
    if logged:
        uid = "demouid"
        return {
            "token":uid,
            "user":{
                "email":email,
                "username":usernameGlobal
            }
        }
    else:
        raise HTTPException(401,"invalid creds")

@app.post('/register')
async def registerM(username:str,email:str,password:str):
    reg = await register(username,password,email,0)
    if reg:
        return { "message": "User registered successfully" }
    else:
        return None

@app.get('/posts')
async def getPostsM():
    posts = await getPosts()
    return posts

@app.get('/getusers')
async def getUsersM():
    users = await getUsers()
    return users

@app.get('/insertUser')
async def addDummy():
    login('demo','demo')