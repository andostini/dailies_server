import functools
import os
from shutil import rmtree
from markupsafe import escape
from pprint import pprint
import json



from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from flaskr.db import get_db

from . import Covideo_Library
from . import silverstack


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
                        liveStreams[i] = {
                            "embedd": '<div class="youtube-player"><iframe width="100%" height="auto" src="' + url + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>',
                            "url": url,
                            "service": "Youtube",
                            "streamKey": " - "
                        }
                    elif service == "dacast":
                        liveStreams[i] = {
                            "embedd": '<div class="dacast-player"><script src="https://player.dacast.com/js/player.js?contentId=' + url + '" id="' + url + '" width="100%" height="auto" class="dacast-video"></script></div>',
                            "url": url,
                            "service": Dacast,
                            "streamKey": " - "
                        }

                else:
                    letters = ['A','B','C','D'] #To retranslate iterator "i" to the camera letter
                    liveStreams[i] =  {
                        "embedd": '<video id="liveStream' + letters[i] + '" class="video-js vjs-default-skin vjs-16-9" controls preload="false" loop></video>',
                        "url": "https://stream.franconia-film.de:32774/live/",
                        "service": 'Covideo - <span id="streamStatus' + letters[i] + '"></span>',
                        "streamKey": projectId + "-camera" + letters[i]
                    }

            if project != None:
                session['current_project'] = projectId
                return render_template('app/viewer.html', error=error, success=success, project = project, liveStreams = liveStreams)
            else:
                return 'Project not found'
        else:
            return redirect(url_for('login.login', projectId = projectId))

    else:
        return redirect(url_for('login.login', projectId = projectId))


#ONLY TEMPORARY UNTIL NEW FRONT endif

@bp.route('/<projectId>-theatre', methods=['GET'])
def theatre(projectId):
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
                        liveStreams[i] = {
                            "embedd": '<div class="youtube-player"><iframe width="100%" height="auto" src="' + url + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>',
                            "url": url,
                            "service": "Youtube",
                            "streamKey": " - "
                        }
                    elif service == "dacast":
                        liveStreams[i] = {
                            "embedd": '<div class="dacast-player"><script src="https://player.dacast.com/js/player.js?contentId=' + url + '" id="' + url + '" width="100%" height="auto" class="dacast-video"></script></div>',
                            "url": url,
                            "service": Dacast,
                            "streamKey": " - "
                        }

                else:
                    letters = ['A','B','C','D'] #To retranslate iterator "i" to the camera letter
                    liveStreams[i] =  {
                        "embedd": '<video id="liveStream' + letters[i] + '" class="video-js vjs-default-skin vjs-16-9" controls preload="false" loop height="100%"></video>',
                        "url": "https://stream.franconia-film.de:32774/live/",
                        "service": 'Covideo',
                        "streamKey": projectId + "-camera" + letters[i]
                    }

            if project != None:
                session['current_project'] = projectId
                return render_template('viewer/theatre.html', error=error, success=success, project = project, liveStreams = liveStreams)
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
            return redirect(url_for('viewer.project', projectId = projectId))

    else:
        return redirect(url_for('index'))


@bp.route('/<projectId>/upload/files', methods=('GET','POST'))
def upload_files(projectId):
    error = []
    success = []
    db = get_db()
    project = db.execute('SELECT * FROM projects WHERE id = ?', (escape(projectId),)).fetchone()

    files = request.files.getlist('file')

    video_ext = {'mov', 'mp4'}
    still_ext = {'jpeg', 'jpg', 'png'}
    meta_ext = {'xml'}
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
                lib.createThumb(filename, ext)



        elif ext in still_ext:
            clipname = secure_filename(file.filename)
            file.save(os.path.join('flaskr/static/projects/project-' + projectId + '/stills', clipname))
            success.append(file.filename + ' has been added as still')

        elif ext in meta_ext:
            labelMapping = {
                'waste_clip' : project['mapWaste_clip'],
                'normal_take' : project['mapNormal_take'],
                'good_take' : project['mapGood_take'],
                'fav_take' : project['mapFav_take']
            }
            metaData = silverstack.silverstack(file, labelMapping).getMetaObject() #also checks validaty and returns false if XML does not contain usable XML
            if metaData:

                for clip in metaData:
                    if lib.searchEntry(clip['clipname']) == None:
                        lib.addEntry(clip)
                    else:
                        lib.setMeta(clip['clipname'], 'reel', clip['reel'])
                        lib.setMeta(clip['clipname'], 'scene', clip['scene'])
                        lib.setMeta(clip['clipname'], 'shot', clip['shot'])
                        lib.setMeta(clip['clipname'], 'take', clip['take'])
                        lib.setMeta(clip['clipname'], 'comment', clip['comment'])
                        lib.setMeta(clip['clipname'], 'label', clip['label'])
                        lib.setMeta(clip['clipname'], 'camera', clip['camera'])
                        lib.setMeta(clip['clipname'], 'cameraMeta', clip['cameraMeta'])
                success.append('Metadata from ' + file.filename + ' was applied to your library')
            else:
                error.append(file.filename + ' was not correctly parsed by our software.')
        else:
            error.append(file.filename + ' is not of accpeted file extension')
    return render_template('viewer/upload.html', error=error, success=success, project = project)


@bp.route('/projectmanager', methods=('GET', 'POST'))
def projectmanager():
    if 'username' in session:
        username = session['username']
        allowed = False

        if username == 'dit':
            allowed = True

        if allowed:
            error = []
            success = []
            db = get_db()
            if request.method == 'POST':
                name=request.form['name']
                password=request.form['password']
                id=request.form['id']
                mapWaste_clip=request.form['waste_clip']
                mapNormal_take=request.form['normal_take']
                mapGood_take=request.form['good_take']
                mapFav_take=request.form['fav_take']
                cameraA=request.form['cameraA']
                cameraB=request.form['cameraB']
                cameraC=request.form['cameraC']
                cameraD=request.form['cameraD']

                if id == "New Project":
                    cursor = db.cursor()
                    cursor.execute(
                        'INSERT INTO projects (name, password, mapWaste_clip,mapNormal_take, mapGood_take, mapFav_take, cameraA, cameraB, cameraC, cameraD) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        (name, password, mapWaste_clip,mapNormal_take, mapGood_take, mapFav_take, cameraA, cameraB, cameraC, cameraD)
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
                        'UPDATE projects SET name = ?, password = ?, mapWaste_clip = ?,mapNormal_take = ?, mapGood_take = ?, mapFav_take = ?, cameraA = ?, cameraB = ?, cameraC = ?, cameraD = ? WHERE id=?',
                        (name, password, mapWaste_clip,mapNormal_take, mapGood_take, mapFav_take, cameraA, cameraB, cameraC, cameraD, id)
                    )
                    db.commit()
                    success.append('Project updated')

            projects = db.execute('SELECT * FROM projects ORDER BY created DESC').fetchall()
            return render_template('viewer/projectmanager.html', success=success, error=error, projects=projects, session = session)

        else:
            return redirect(url_for('viewer.project', projectId = session['current_project']))

    else:
        return redirect(url_for('index'))

@bp.route('<projectId>/meta', methods=('GET', 'POST'))
def meta(projectId):

    if 'username' in session:
        username = session['username']
        allowed = False

        if username == 'dit':
            allowed = True

        if allowed:
            error = []
            success = []

            db = get_db()
            project = db.execute('SELECT * FROM projects WHERE id = ?', (escape(projectId),)).fetchone()

            return render_template('viewer/metaeditor.html', project=project, success=success, error=error, session = session)
        else:
            return redirect(url_for('viewer.project', projectId = session['current_project']))

    else:
        return redirect(url_for('index'))
