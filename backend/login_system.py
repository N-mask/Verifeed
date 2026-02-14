from fastapi import FastAPI,Cookie,Response,Request
from login_db import LoginDB,LoggedInUsers,sessions
from typing import Annotated
import uuid
#from fastapi.responses import *
#### file=open("file_name",read) --> FILE HANDLING
    
if __name__ =="__main__":
    app=FastAPI()
    login=LoginDB()
    current_user=LoggedInUsers()

    # login system 
    @app.get("/")
    async def landing(request:Request):
        session_id=request.cookies.get("session_id")
        user_name=str("NOT LOGGED IN")
        if session_id:
            if session_id in sessions:
                user_name=sessions[session_id]
        return {
                    "message":"VeriFeed: Where truth is the only Currency",
                    "user logged in":user_name
            }

    @app.post("/register")
    async def register(user_name:str,pass_word:str,expert_or_not:int):
        if user_name in login.login_map:
            return "USER ALREADY REGISTERED"
        login.login_map[user_name]=pass_word
        login.expert_user[user_name]=expert_or_not
        return "SUCCESS"


    @app.get("/login")
    async def login_(user_name:str,pass_word:str,response:Response,request:Request):
        session_id=request.cookies.get("session_id")
        if session_id in sessions:
            logged_in_user=sessions[session_id]
            return {
                        "message":"Already logged in (Active session)",
                        "user name":logged_in_user
                }
        if user_name in sessions:
            return {
                        "message":"User Already logged in other active session (Active session)",
                        "user name":user_name
                }
        if user_name in login.login_map:
            if login.login_map[user_name]==pass_word:
                session_id=str(uuid.uuid4())
                sessions[session_id]=user_name
                response.set_cookie(
                    key="session_id",
                    value=session_id,
                    httponly=True,
                    secure=False,
                    samesite="lax"
                )
                return  {
                            "message": "LOGIN SUCCESS",
                            "expert": login.expert_user[user_name]
                        }
            else:
                return
        return "INVALID CREDENTIALS"

    @app.put("/login/forgot-password")
    async def forgot_password(user_name:str,new_password:str):
        if user_name in login.login_map:
            login.login_map[user_name]=new_password;
            return {
                        "message":"User Found and credentials updated. ",
                        "password":"New Password: " + login.login_map[user_name]
                }
        return "NOT FOUND" 

    @app.get("/logout")
    async def logout(request:Request):
        session_id=request.cookies.get("session_id")
        if session_id:
            if session_id in sessions:
                sessions.pop(session_id);
                return "User Logged Out Successfully"
        return "Not logged in"

    @app.get("/who-the-fuck-am-i")
    async def wtfai(request:Request):
        session_id=request.cookies.get("session_id")
        if session_id:
            if session_id in sessions:
                return sessions[session_id];        
        return ["Login toh karle chutiye"]
