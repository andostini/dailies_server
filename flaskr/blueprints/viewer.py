import os
from shutil import rmtree
from markupsafe import escape



from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from flaskr.db import get_db

from flaskr.services import Covideo_Library
from flaskr.services import Silverstack


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
    error = []
    success = []
    db = get_db()
    projectDB = db.execute('SELECT * FROM projects WHERE id = ?', (escape(projectId),)).fetchone()


    if projectDB != None:
        session['current_project'] = projectId

        ## WILL HAVE TO MOVE INTO API FOR AUTH REASONS
        project = {
            'id' : projectDB['id'],
            'name': projectDB['name'],
            'created' : projectDB['created'],
            'libraryPageVisible': projectDB['libraryPageVisible'],
            'livePageVisible' : projectDB['livePageVisible']
        }   

        ## MAKE LIVE STREAM OBJECT
        ## WILL HAVE TO MOVE INTO API FOR AUTH REASONS
        liveStreams =[projectDB['cameraA'],projectDB['cameraB'],projectDB['cameraC'],projectDB['cameraD']]
        for i, stream in enumerate(liveStreams):
            letters = ['A','B','C','D'] #To retranslate iterator "i" to the camera letter
            if (stream != "" and ":" in stream):
                service = stream.split(':',1)[0]
                url = stream.split(':',1)[1]
                if service == "youtube":
                    liveStreams[i] = {
                        "url": url,
                        "service": "Youtube",
                        "streamKey": " - " ,
                        'camera' : letters[i]
                    }
                else: 
                    
                    liveStreams[i] =  {
                        "url": "rtmp://stream.franconia-film.de:32774/live/",
                        "service": 'Covideo',
                        "streamKey": projectId + "-camera" + letters[i],
                        'camera' : letters[i]
                    }

            else:
                letters = ['A','B','C','D'] #To retranslate iterator "i" to the camera letter
                liveStreams[i] =  {
                    "url": "rtmp://stream.franconia-film.de:32774/live/",
                    "service": 'Covideo',
                    "streamKey": projectId + "-camera" + letters[i],
                    'camera' : letters[i]
                }
        ## END OF LIVE STREAM OBJECT

        return render_template('app/viewer.html', error=error, success=success, project = project, liveStreams = liveStreams)
    else:
        return 'Project not found'


@bp.route('/<projectId>/upload', methods=('GET', 'POST'))
def upload(projectId):
    error = []
    success = []
    db = get_db()
    project = db.execute('SELECT * FROM projects WHERE id = ?', (escape(projectId),)).fetchone()


    if project != None:
        return render_template('viewer/upload.html', error=error, success=success, project = project)
    else:
        return 'Project not found'



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
            metaData = Silverstack.silverstack(file, labelMapping).getMetaObject() #also checks validaty and returns false if XML does not contain usable XML
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


@bp.route('<projectId>/meta', methods=('GET', 'POST'))
def meta(projectId):
    error = []
    success = []

    db = get_db()
    project = db.execute('SELECT * FROM projects WHERE id = ?', (escape(projectId),)).fetchone()

    return render_template('viewer/metaeditor.html', project=project, success=success, error=error, session = session)


