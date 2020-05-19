import functools
import os
from shutil import rmtree
from markupsafe import escape
from pprint import pprint


from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from flaskr.db import get_db

from . import Covideo_Library

bp = Blueprint('viewer', __name__, url_prefix='/viewer')

@bp.route('/', methods=('GET', 'POST'))
def viewer():
    error = []
    success = []

    # FORWARD TO PROJECT IN SESSION
    if 'current_project' in session:
        return redirect(url_for('viewer.project', projectId = session['current_project']))

    # Error Page
    return redirect(url_for('index'))

@bp.route('/<projectId>', methods=('GET', 'POST'))
def project(projectId):
    if projectId == "" and 'current_project' in session:
        projectId = session['current_project']

    if 'username' in session:
        username = session['username']
        allowed = False



        if username == 'dit':
            allowed = True
        else:
            projects = session['projects'].split(';')
            if projectId in projects:
                allowed = True

        if allowed:
            error = []
            success = []
            db = get_db()


            project = db.execute('SELECT * FROM projects WHERE id = ?', (escape(projectId),)).fetchone()

            liveStreams =[project['cameraA'],project['cameraB'],project['cameraC'],project['cameraD']]
            for i, stream in enumerate(liveStreams):
                if (stream != "" and ":" in stream):
                    service = stream.split(':',1)[0]
                    url = stream.split(':',1)[1]
                    if service == "youtube":
                        liveStreams[i] = '<div class="youtube-player"><iframe width="100%" height="auto" src="' + url + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
                    elif service == "dacast":
                        liveStreams[i] = '<div class="dacast-player"><script src="https://player.dacast.com/js/player.js?contentId=' + url + '" id="' + url + '" width="100%" height="auto" class="dacast-video"></script></div>'
                else:
                    letters = ['A','B','C','D'] #To retranslate iterator "i" to the camera letter
                    liveStreams[i] = '<video id="liveStream' + letters[i] + '" class="video-js vjs-default-skin vjs-16-9" controls preload="auto"><source src="https://stream.franconia-film.de/hls/' + projectId + '-camera' + letters[i] + '.m3u8" type="application/x-mpegURL" /></video>'
                    #liveStreams[i] = ''

            if project != None:
                session['current_project'] = projectId
                return render_template('viewer/player.html', error=error, success=success, project = project, liveStreams = liveStreams)
            else:
                return 'Project not found'
        else:
            return redirect(url_for('login.login', projectId = projectId))

    else:
        return redirect(url_for('login.login', projectId = projectId))



@bp.route('/<projectId>/upload', methods=('GET', 'POST'))
def upload(projectId):
    if 'username' in session:
        username = session['username']
        allowed = False

        if username == 'dit':
            allowed = True
        else:
            projects = session['projects'].split(';')
            if projectId in projects:
                allowed = True

        if allowed:
            error = []
            success = []
            db = get_db()
            project = db.execute('SELECT * FROM projects WHERE id = ?', (escape(projectId),)).fetchone()


            if project != None:
                return render_template('viewer/upload.html', error=error, success=success, project = project)
            else:
                return 'Project not found'
        else:
            return redirect(url_for('login.login', projectId = projectId))

    else:
        return redirect(url_for('login.login', projectId = projectId))


@bp.route('/<projectId>/upload/files', methods=('GET','POST'))
def upload_files(projectId):
    error = []
    success = []
    db = get_db()
    project = db.execute('SELECT * FROM projects WHERE id = ?', (escape(projectId),)).fetchone()

    files = request.files.getlist('files')

    video_ext = {'mov', 'mp4'}
    still_ext = {'jpeg', 'jpg', 'png'}
    lib = Covideo_Library.Covideo_Library(projectId)


    for file in files:
        ext = file.filename.rsplit('.', 1)[1].lower()
        if ext in video_ext:
            filename = secure_filename(file.filename)
            file.save(os.path.join('flaskr/static/projects/project-' + projectId + '/video', filename))

            filename = os.path.splitext(filename)[0]


            if lib.searchEntry(filename) == None:
                lib.addEntry({'clipname':filename})
                lib.createThumb(filename, ext)
                success.append(file.filename + ' has been added to the project library')
            else:
                success.append(file.filename + ' has been uploaded')



        elif ext in still_ext:
            clipname = secure_filename(file.filename)
            file.save(os.path.join('flaskr/static/projects/project-' + projectId + '/stills', clipname))
            success.append(file.filename + ' has been added as still')
        else:
            error.append(file.filename + ' is not of accpeted file extension')
    return render_template('viewer/upload.html', error=error, success=success, project = project)




@bp.route('/<projectId>/upload/meta', methods=('GET','POST'))
def upload_meta(projectId):
    return "oaky"

@bp.route('/projectmanager', methods=('GET', 'POST'))
def projectmanager():
    error = []
    success = []
    db = get_db()
    if request.method == 'POST':
        name=request.form['name']
        password=request.form['password']
        id=request.form['id']
        cameraA=request.form['cameraA']
        cameraB=request.form['cameraB']
        cameraC=request.form['cameraC']
        cameraD=request.form['cameraD']

        if id == "New Project":
            cursor = db.cursor()
            cursor.execute(
                'INSERT INTO projects (name, password, cameraA, cameraB, cameraC, cameraD) VALUES (?, ?, ?, ?, ?, ?)',
                (name, password, cameraA, cameraB, cameraC, cameraD)
            ).fetchone()
            db.commit()
            newID = cursor.lastrowid
            os.mkdir('flaskr/static/projects/project-' + str(newID))
            os.mkdir('flaskr/static/projects/project-' + str(newID) + '/video')
            os.mkdir('flaskr/static/projects/project-' + str(newID) + '/thumbs')
            os.mkdir('flaskr/static/projects/project-' + str(newID) + '/stills')
            new_Covideo_library = open('flaskr/static/projects/project-' + str(newID) + '/.Covideo_library.json', 'w')
            init_Covideo_library =  open('flaskr/static/json/Covideo_library_init.json', 'r')
            new_Covideo_library.write(init_Covideo_library.read())

            init_Covideo_library.close()
            new_Covideo_library.close()



            success.append('Project created')
        elif "DELETE" in request.form:
            db.execute(
                'DELETE FROM projects WHERE id = ?', (id,)
            )
            db.commit()
            rmtree('flaskr/static/projects/project-' + id)
            success.append('Project was deleted')

        else:
            db.execute(
                'UPDATE projects SET name = ?, password = ?, cameraA = ?, cameraB = ?, cameraC = ?, cameraD = ? WHERE id=?',
                (name, password, cameraA, cameraB, cameraC, cameraD, id)
            )
            db.commit()
            success.append('Project updated')

    projects = db.execute('SELECT * FROM projects ORDER BY created DESC').fetchall()
    return render_template('viewer/projectmanager.html', success=success, error=error, projects=projects, session = session)


@bp.route('<projectId>/meta', methods=('GET', 'POST'))
def meta(projectId):
    error = []
    success = []

    db = get_db()
    project = db.execute('SELECT * FROM projects WHERE id = ?', (escape(projectId),)).fetchone()

    if session['username'] == 'dit':
        return render_template('viewer/metaeditor.html', project=project, success=success, error=error, session = session)
    else:
        return redirect(url_for('login.login', projectId = projectId))
