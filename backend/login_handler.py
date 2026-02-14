import sqlite3

current_user = ''
connection = sqlite3.Connection('users.sql3',check_same_thread=False)
connection.execute('CREATE TABLE IF NOT EXISTS users (username VARCHAR PRIMARY KEY ,email VARCHAR,password VARCHAR,admin INT)')
connection.commit()
usernameGlobal = ''

async def register(username:str,password:str,mail:str,adminStatus:int):
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM users where username=?',(username,))
    if not cursor.fetchone():
        cursor.execute('INSERT into users (username,email,password,admin) VALUES (?,?,?,?)',(username,mail,password,adminStatus))
    else:
        return False
    connection.commit()
    return login(mail,password)

async def getUserName(email:str):
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM users  WHERE email=?',(email,))
    connection.commit()
    return str(cursor.fetchone())

async def login(mail:str,password:str):
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM users WHERE email=? AND password=?',(mail,password))
    data = cursor.fetchone()
    connection.commit()
    if data:
        return True
    else:
        return False

async def getUsers():
    cursor = connection.cursor()
    cursor.execute('SELECT * from users')
    connection.commit()
    data = cursor.fetchall()
    return data