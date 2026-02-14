import sqlite3
from fastapi import FastAPI

connection = sqlite3.Connection('lib.db',check_same_thread=False)
connection.execute('CREATE TABLE IF NOT EXISTS content (title VARCHAR,rating REAL,user VARCHAR,content VARCHAR)')
connection.commit()
#Ensure that the user who has created the post can only del it


async def postNew(title : str,rating:float,user:str,content:str):
    cursor = connection.cursor()
    cursor.execute('INSERT into content (title,rating,user,content) VALUES (?,?,?,?)',(title,rating,user,content))
    connection.commit()
    return "Working..."

async def getPosts():
    cursor = connection.cursor()
    cursor.execute("select * FROM content")
    posts = cursor.fetchall()
    return posts

async def delAll(adminStaus:int):
    if adminStaus == 1:
        cursor = connection.cursor()
        x = cursor.execute('DROP TABLE IF EXISTS content')
        connection.commit()
        return f"Deleted data {x}"
    else:
        return "No admin privileges"
async def delPost(title:str):
    ...
f = FastAPI()
@f.get('/')
def run():
    title = input('Enter title: ')
    rating = float(input('Enter demo rating: '))
    user = input('Enter user: ')
    cont = input('Enter content: ')
    postNew(title,rating=rating,user=user,content=cont)