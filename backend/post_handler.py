import sqlite3
from fastapi import FastAPI

connection = sqlite3.Connection('lib.db',check_same_thread=False)
connection.execute('CREATE TABLE IF NOT EXISTS content (title VARCHAR PRIMARY KEY,rating REAL,user VARCHAR,content VARCHAR)')
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
    results = []
    for post in posts:
        results.append({
            "title": post[0],  
            "rating": post[1], 
            "user": post[2],   
            "content": post[3]
        })
    return results

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
    
async def ratePost(user: str, post_title: str, score: int):
    cursor = connection.cursor()
    cursor.execute('INSERT OR REPLACE INTO votes (user, post_title, score) VALUES (?, ?, ?)', (user, post_title, score))
    cursor.execute('SELECT AVG(score) FROM votes WHERE post_title=?', (post_title,))
    new_avg = cursor.fetchone()[0]
    cursor.execute('UPDATE content SET rating=? WHERE title=?', (new_avg, post_title))
    connection.commit()
    return new_avg