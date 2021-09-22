from flask import (
    send_file,Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db
import io
import os
import json

from flaskr.services import Auth
from flaskr.services import Covideo_Library

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/get_CovideoLibrary/<projectId>', methods=('GET','POST'))
def get_CovideoLibrary(projectId):
    if request.method == "POST":
        data = request.json
        if Auth.validate(data['access_token'], project_token=data['project_token'], min_user_group=10, related_project=projectId):
            lib = Covideo_Library.Covideo_Library(projectId).get()
            playbackfiles = os.listdir('flaskr/static/projects/project-' + projectId + '/video')
            stillfiles = os.listdir('flaskr/static/projects/project-' + projectId + '/stills')
            thumbnails = os.listdir('flaskr/static/projects/project-' + projectId + '/thumbs')

            for entry in lib:
                for playbackfile in playbackfiles:
                    if entry['clipname'] == os.path.splitext(playbackfile)[0]:
                        entry['playbackfile'] = playbackfile

                for index, stillfile in enumerate(stillfiles):
                    if entry['clipname'] == stillfile.rsplit('_', 1)[0]:
                        entry['stills'].append(stillfile)

                for thumbnail in thumbnails:
                    if entry['clipname'] == os.path.splitext(thumbnail)[0]:
                        entry['thumbnail'] = thumbnail

                if entry['thumbnail'] == "" and len(entry['stills']) > 0:
                    entry['thumbnail'] = url_for('static', filename="/projects/project-" + projectId + '/stills/' + entry['stills'][0]);
                elif entry['thumbnail'] == "":
                    entry['thumbnail'] = url_for('static', filename="/img/no-thumb.png");
                else:
                    entry['thumbnail'] = url_for('static', filename="/projects/project-" + projectId + '/thumbs/' + entry['thumbnail']);

            return json.dumps(lib)
        else:
            return "false", 401
    else:
        return 'Bad Request'

@bp.route('/getProjectInfo/<projectId>', methods=['POST'])
def getProjectInfo(projectId):
    db = get_db()
    projectDB = db.execute('SELECT * FROM projects WHERE id = ?', (projectId,)).fetchone()
    data = request.json
    if Auth.validate(data['access_token'], project_token=data['project_token'], min_user_group=10, related_project=projectId):
        project = {
            'id' : projectDB['id'],
            'name': projectDB['name'],
            'created' : '',
            'libraryPageVisible': projectDB['libraryPageVisible'],
            'livePageVisible' : projectDB['livePageVisible'],
            'writePermission': Auth.validate(data['access_token'], min_user_group=5, related_project=projectId),
        }   

        ## MAKE LIVE STREAM OBJECT
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
        
        return json.dumps({
            'project': project,
            'liveStreams': liveStreams
        })

    
    else:
        # Get basic info for unauthorized people prior to login
        project = {
            'id' : projectDB['id'],
            'name': projectDB['name'],
        }

        return json.dumps({
            'project': project
        })

       

@bp.route('/setMetadata/<projectId>', methods=['GET','POST'])
def setMetadata(projectId):
    if Auth.validate(data['access_token'], project_token=data['project_token'], min_user_group=5, related_project=projectId):
        clipname=request.json['clipname']
        key = request.json['att']
        value = request.json['value']

        lib = Covideo_Library.Covideo_Library(projectId)
        print(lib.searchEntry(value))


        if key == 'clipname' and lib.searchEntry(value) != None:
            return "Duplicate clipname! A clipname can only exist once"

        lib.setMeta(clipname, key, value)
        return key + ' of ' + clipname + " has been updated to " + value
    else:
        return "false", 401

@bp.route('/addEntry/<projectId>', methods=['POST'])
def addEntry(projectId):
    if Auth.validate(data['access_token'], project_token=data['project_token'], min_user_group=5, related_project=projectId):
        newEntry = request.json
        lib = Covideo_Library.Covideo_Library(projectId)

        if lib.searchEntry(newEntry['clipname']) != None:
            return "Duplicate clipname. Clip has not been added to the library"

        lib.addEntry(newEntry)
        return 'Received'
    else:
        return "false", 401

@bp.route('/deleteEntry/<projectId>', methods=['POST'])
def deleteEntry(projectId):
    if Auth.validate(data['access_token'], project_token=data['project_token'], min_user_group=5, related_project=projectId):
        killEntry = request.json
        lib = Covideo_Library.Covideo_Library(projectId)

        if lib.searchEntry(killEntry['clipname']) == None:
            return "A clip with this name does not exist in your library"

        lib.deleteEntry(killEntry)
        return 'Deleted'
    else:
        return "false", 401


@bp.route('/getUserInfo', methods=['POST'])
def getUserInfo():
    data = request.json
    if Auth.validate(data['access_token'], min_user_group=5):
        res = Auth.getUserInfo(data["access_token"])
        return json.dumps(res)
    else:
        return "false", 401



@bp.route('/images/<string:table>/<int:id>.png')
def get_image(table, id):
    db = get_db()
    user = db.execute('SELECT avatar FROM ' + table + ' WHERE id = ?', (id,)).fetchone()

    return send_file(
        io.BytesIO(user["avatar"]),
        mimetype='image/png',
        as_attachment=True,
        attachment_filename='%s.png' % id)

