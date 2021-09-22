import json
from os import environ
from sqlite3.dbapi2 import enable_shared_cache
import jwt
import datetime
from passlib.hash import sha256_crypt

from flask import (
    Blueprint, redirect, render_template, request, url_for, abort
)

from flaskr.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/login/<projectId>', methods=('GET','POST'))
def plogin(projectId):  #This Login is for single project
    db = get_db();
    project = db.execute(
        'SELECT * FROM projects WHERE id = ?', (projectId,)
    ).fetchone()

    if request.method == "GET": 
        if project == None:
            abort(404)
        else:
            return render_template('app/login.html')


    elif request.method == "POST":
        if project == None:
            abort(404)
        else:
            response = {
                "error": None,
                "project_token": None,
            }
            data = request.json
            if sha256_crypt.verify(data['password'], project['password']):
                tokenData = {
                    "exp" : datetime.datetime.utcnow() + datetime.timedelta(hours=24),
                    "projects": []
                }
                if data["project_token"] != None:
                    tokenData = jwt.decode(data["project_token"], environ["SECRET"], algorithms=["HS256"])
                
                tokenData['projects'].append(projectId)
                response['project_token'] = jwt.encode(tokenData, environ["SECRET"], algorithm='HS256')

            else:
                response["error"] = "Wrong password"



            return response


@bp.route('/login', methods=('GET', 'POST'))
def login():   #This Login is only for Admins and DITs
    if request.method == "GET": 
        return render_template('app/login.html')


    elif request.method == "POST":
        response = {
            "error": None,
            "user": None,
            "userName": None
        }
        data = request.form
        db = get_db();
        user = db.execute(
            'SELECT * FROM users WHERE userName = ?', (data['userName'],)
        ).fetchone()

        if user != None and sha256_crypt.verify(data['password'], user['password']): ## User exists and passwords match
            SECRET = environ["SECRET"]
            exp = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            token_data = {
                "exp" : exp,
                "id" : user["id"],
                "userName" : user["userName"],
                "userGroup" : user["userGroup"],
                "name" : user["name"],
                "eMail" : user["eMail"],
                "maxGB" : user["maxGB"],
                "maxProjectNumber" : user["maxProjectNumber"],
                "expirationDate" : user["expirationDate"],
                "liveStreamPlugin" : user["liveStreamPlugin"],
            }
            response['access_token'] = jwt.encode(token_data, SECRET, algorithm="HS256", )
            response['userName'] = user["userName"]

        else:
            response["error"] = "Invalid credentials."

    
        return json.dumps(response)


    else:
        return 'Bad request'


@bp.route('/logout', methods=('GET', 'POST'))
def logout():  
    if request.method == "GET":
        return render_template('app/logout.html')
    else:
        data = request.json
        Auth.devalidate("access_token", data["access_token"])
        Auth.devalidate("project_token", data["project_token"])
        
        return "Good"

