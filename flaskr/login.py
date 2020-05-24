import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db

bp = Blueprint('login', __name__, url_prefix='/login')


@bp.route('/<projectId>', methods=('GET','POST'))
def login(projectId):  #This Login is for single project
    success=[]
    error=[]
    db = get_db();
    project = db.execute(
        'SELECT * FROM projects WHERE id = ?', (projectId,)
    ).fetchone()

    if project == None:
        error.append('A project with this ID does not exist. Please ask your DIT or post production manager for the project ID and project password.')
        return render_template('website/index.html', error=error, success=success)
    else:
        if request.method == "POST":
            username = request.form['username']
            password = request.form['password']

            #Add Project to user session
            if username == "viewer" and password == project['password']:
                session['username'] = username
                if 'projects' in session:
                    session['projects'] = session['projects'] + ';' + projectId
                else:
                    session['projects'] = projectId

                return redirect(url_for('viewer.project', projectId = projectId))

            #Make generell DIT Login for all projects
            elif username == "dit" and password == "wurst":
                session['username'] = username
                session['projects'] = None
                return redirect(url_for('viewer.projectmanager'))
            else:
                error.append('Wrong password')
                return render_template('login.html', project=project, error=error, success=success)
        else:
            return render_template('login.html', project=project, error=error, success=success)

@bp.route('/', methods=('GET', 'POST'))
def mlogin():   #This Login is only for Admins and DITs
    success=[]
    error=[]
    db = get_db();
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']

        if username == "dit" and password == "wurst":
            session['username'] = username
            session['projects'] = None
            return redirect(url_for('viewer.projectmanager'))
        else:
            error.append('Wrong password')
            return render_template('mlogin.html', error=error, success=success)
    else:
        return render_template('mlogin.html', error=error, success=success)
