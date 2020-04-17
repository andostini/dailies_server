import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db

import os
import json


from . import Covideo_Library

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/get_CovideoLibrary/<projectId>', methods=('GET','POST'))
def get_CovideoLibrary(projectId):
    if request.method == "POST":
        lib = Covideo_Library.Covideo_Library(projectId).get()
        playbackfiles = os.listdir('flaskr/static/projects/project-' + projectId + '/video')
        stillfiles = os.listdir('flaskr/static/projects/project-' + projectId + '/stills')
        thumbnails = os.listdir('flaskr/static/projects/project-' + projectId + '/thumbs')

        for entry in lib:
            for playbackfile in playbackfiles:
                if entry['clipname'] == os.path.splitext(playbackfile)[0]:
                    entry['playbackfile'] = playbackfile

            for thumbnail in thumbnails:
                if entry['clipname'] == os.path.splitext(thumbnail)[0]:
                    entry['thumbnail'] = thumbnail
            if entry['thumbnail'] == "":
                entry['thumbnail'] = url_for('static', filename="/img/no-thumb.png");
            else:
                entry['thumbnail'] = url_for('static', filename="/projects/project-" + projectId + '/thumbs/' + entry['thumbnail']);

            for index, stillfile in enumerate(stillfiles):
                if entry['clipname'] == stillfile.rsplit('_', 1)[0]:
                    entry['stills'].append(stillfile)

        return json.dumps(lib)
    else:
        return 'Bad Request'

@bp.route('/setMetadata/<projectId>', methods=['GET','POST'])
def setMetadata(projectId):
    clipname=request.json['clipname']
    key = request.json['att']
    value = request.json['value']

    lib = Covideo_Library.Covideo_Library(projectId)
    print(lib.searchEntry(value))


    if key == 'clipname' and lib.searchEntry(value) != None:
        return "Duplicate clipname! A clipname can only exist once"

    lib.setMeta(clipname, key, value)
    return key + ' of ' + clipname + " has been updated to " + value

@bp.route('/addEntry/<projectId>', methods=['POST'])
def addEntry(projectId):
    newEntry = request.json
    lib = Covideo_Library.Covideo_Library(projectId)

    for key in newEntry:
        print(key + ":" + newEntry[key])

    if lib.searchEntry(newEntry['clipname']) != None:
        return "Duplicate clipname. Clip has not been added to the library"

    lib.addEntry(newEntry)



    return 'Received'
