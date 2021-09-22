import os, json
from shutil import rmtree

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from passlib.hash import sha256_crypt

from flaskr.db import get_db

bp = Blueprint('settings', __name__, url_prefix='/settings')


@bp.route('/', methods=('GET', 'POST'))
def settings():
    if request.method == 'GET':
        return render_template('app/settings.html')
    else:
        print(request.form)
        return render_template('app/settings.html')




### USER MANAGEMENT API ###


@bp.route('/newUser', methods=('GET', 'POST'))
def newUser():
    if request.method == 'POST':
        data = request.form
        db = get_db()
        response = {
            'errors': [],
            'succeed': []
        }

        if checkDuplicateUser(data):
            if 'liveStreamPlugin' not in data:
                liveStreamPlugin = False
            else:
                liveStreamPlugin = True
            cursor = db.cursor()
            cursor.execute(
                'INSERT INTO users (userName, password, userGroup, name, eMail, phone, billing, maxGB, maxProjectNumber, expirationDate, liveStreamPlugin, avatar) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                (data['userName'], sha256_crypt.encrypt(data['password']), data['userGroup'], data['name'], data['eMail'], data['phone'],
                 data['billing'], data['maxGB'], data['maxProjectNumber'], data['expirationDate'], liveStreamPlugin, '',)
            ).fetchone()
            db.commit()
            response['succeed'].append(
                'The user ' + data['userName'] + ' has been created')
        else:
            response['errors'].append(
                'A user with this username or email already exists')

        return json.dumps(response)
    else:
        abort(400)


@bp.route('/updateUser', methods=('GET', 'POST'))
def updateUser():
    if request.method == 'POST':
        data = request.form
        currentData = getOneUser(data['id'])
        db = get_db()

        response = {
            'errors': [],
            'succeed': []
        }

        validation = True
        # Check for duplicate user if username change
        if currentData['userName'] != data['userName']:
            if checkDuplicateKey('userName', data['userName']):
                validation = False
                response['errors'].append(
                    'The new username you chose already exists')

        # Check for duplicate email if email change
        if currentData['eMail'] != data['eMail']:
            if checkDuplicateKey('eMail', data['eMail']):
                validation = False
                response['errors'].append(
                    'The new email you entered already exists')


        if validation: 
            if 'liveStreamPlugin' not in data:
                liveStreamPlugin = False
            else:
                liveStreamPlugin = True
            cursor = db.cursor()
            cursor.execute(
                'UPDATE users SET userName = ?, userGroup = ?, name = ?, eMail = ?, phone = ?, billing=?, maxGB=?, maxProjectNumber = ?, expirationDate= ?, liveStreamPlugin = ?, avatar = ? WHERE id = ?',
                (data['userName'], data['userGroup'], data['name'], data['eMail'], data['phone'], data['billing'],
                 data['maxGB'], data['maxProjectNumber'], data['expirationDate'], liveStreamPlugin, '', data['id'])
            )
            db.commit()
            response['succeed'].append('The user ' + data['userName'] + ' has been edited')

            if 'password' in data:
                cursor.execute(
                    'UPDATE users SET password= ? WHERE id = ?',
                    (sha256_crypt.encrypt(data['password']),data['id'])
                )
                db.commit()
                response['succeed'].append(
                    'The users ' + data['userName'] + ' password has been edited')

            if 'avatar' in request.files:
                avatar = request.files["avatar"]
                avatarBlob = avatar.read()
                cursor.execute(
                    'UPDATE users SET avatar= ? WHERE id = ?',
                    (avatarBlob,data['id'])
                )
                db.commit()
                response['succeed'].append(
                    'The users ' + data['userName'] + ' avatar has been edited')
                

        return json.dumps(response)

    else:
        abort(400)


@bp.route('/deleteUser', methods=('GET', 'POST'))
def deleteUser():
    data = request.json
    db = get_db()
    response = {
        'errors': [],
        'succeed': []
    }

    db.execute('DELETE FROM users WHERE id = ?', (data['id'],))
    db.commit()

    response['succeed'].append('The user ' + data['userName'] + ' has been deleted')

    return json.dumps(response)


@bp.route('/getUsers', methods=('GET', 'POST'))
def getUsers():
    if request.method == 'POST':
        db = get_db()
        usersDB = db.execute(
            'SELECT * FROM users ORDER BY created DESC').fetchall()
        users = []
        for user in usersDB:
            users.append({
                'id': user['id'],
                'userName': user['userName'],
                'lastLogin': user['lastLogin'],
                'userGroup': user['userGroup'],
                'name': user['name'],
                'eMail': user['eMail'],
                'billing': user['billing'],
                'phone': user['phone'],
                'maxGB': user['maxGB'],
                'maxProjectNumber': user['maxProjectNumber'],
                'expirationDate': user['expirationDate'],
                'liveStreamPlugin': user['liveStreamPlugin']
            })

        return json.dumps(users)
    else:
        abort(400)


def checkDuplicateKey(key, value):
    db = get_db()
    txt = 'SELECT * FROM users WHERE ' + key + ' = "' + value + '"'
    counter = db.execute(txt).fetchone()
    print(counter)
    if counter == None:
        return False
    else:
        return True


def checkDuplicateUser(user):
    db = get_db()
    counter = db.execute('SELECT * FROM users WHERE userName = ? OR eMail = ?',
                         (user['userName'], user['eMail'],)).fetchone()

    if counter == None:
        return True
    else:
        return False


def getOneUser(id):
    db = get_db()

    user = db.execute('SELECT * FROM users WHERE id = ?', (id,)).fetchone()

    user = {
        'id': user['id'],
        'userName': user['userName'],
        'lastLogin': user['lastLogin'],
        'userGroup': user['userGroup'],
        'name': user['name'],
        'eMail': user['eMail'],
        'billing': user['billing'],
        'maxGB': user['maxGB'],
        'maxProjectNumber': user['maxProjectNumber'],
        'expirationDate': user['expirationDate'],
        'liveStreamPlugin': user['liveStreamPlugin']
    }
    return user




### PROJECT MANAGEMENT API ###



@bp.route('/newProject', methods=('GET', 'POST'))
def newProject():
    if request.method == 'POST':
        data = request.form
        db = get_db()
        response = {
            'errors': [],
            'succeed': []
        }

        if 'libraryPageVisible' not in data:
            libraryPageVisible = False
        else:
            libraryPageVisible = True

        if 'livePageVisible' not in data:
            livePageVisible = False
        else:
            livePageVisible = True

        cursor = db.cursor()
        cursor.execute(
            'INSERT INTO projects (name, owner, password, mapWaste_clip, mapNormal_take, mapGood_take, mapFav_take, cameraA, cameraB, cameraC, cameraD, libraryPageVisible, livePageVisible) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
            (data['name'],data['owner'], sha256_crypt.encrypt(data['password']), data['mapWaste_clip'], data['mapNormal_take'], data['mapGood_take'], data['mapFav_take'], 
            data['cameraA'], data['cameraB'], data['cameraC'], data['cameraD'], libraryPageVisible, livePageVisible, )
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




        response['succeed'].append(
            'The project ' + data['name'] + ' has been created')

        return json.dumps(response)
    else:
        abort(400)


@bp.route('/updateProject', methods=('GET', 'POST'))
def updateProject():
    if request.method == 'POST':
        data = request.form
        currentData = getOneProject(data['id'])
        db = get_db()

        response = {
            'errors': [],
            'succeed': []
        }


        if 'libraryPageVisible' not in data:
            libraryPageVisible = False
        else:
            libraryPageVisible = True

        if 'livePageVisible' not in data:
            livePageVisible = False
        else:
            livePageVisible = True

        cursor = db.cursor()
        cursor.execute(
            'UPDATE projects SET name = ?, owner = ?, mapWaste_clip = ?, mapNormal_take = ?, mapGood_take = ?, mapFav_take = ?, cameraA=?, cameraB=?, cameraC = ?, cameraD= ?, libraryPageVisible = ?, livePageVisible = ? WHERE id = ?',
            (data['name'], data['owner'], data['mapWaste_clip'], data['mapNormal_take'], data['mapGood_take'], data['mapFav_take'], data['cameraA'],
             data['cameraB'], data['cameraC'], data['cameraD'], libraryPageVisible, livePageVisible, data['id'])
        )
        db.commit()
        response['succeed'].append('The project ' + data['name'] + ' has been edited')

        if 'password' in data:
            cursor.execute(
                'UPDATE projects SET password= ? WHERE id = ?',
                (sha256_crypt.encrypt(data['password']),data['id'])
            )
            db.commit()
            response['succeed'].append(
                'The project ' + data['name'] + ' password has been edited')

        if 'avatar' in request.files:
            avatar = request.files["avatar"]
            avatarBlob = avatar.read()
            cursor.execute(
                'UPDATE projects SET avatar= ? WHERE id = ?',
                (avatarBlob,data['id'])
            )
            db.commit()
            response['succeed'].append(
                'The project ' + data['name'] + ' avatar has been edited')
                

        return json.dumps(response)

    else:
        abort(400)


@bp.route('/deleteProject', methods=('GET', 'POST'))
def deleteProject():
    data = request.json
    db = get_db()
    response = {
        'errors': [],
        'succeed': []
    }

    db.execute('DELETE FROM projects WHERE id = ?', (data['id'],))
    db.commit()
    rmtree('flaskr/static/projects/project-' + str(data['id']))

    response['succeed'].append('The project ' + data['name'] + ' has been deleted')

    return json.dumps(response)


@bp.route('/getProjects', methods=('GET', 'POST'))
def getProjects():
    if request.method == 'POST':
        db = get_db()
        projectsDB = db.execute(
            'SELECT * FROM projects ORDER BY created DESC').fetchall()
        projects = []
        for project in projectsDB:
            projects.append({
                'id': project['id'],
                'name': project['name'],
                'owner': project['owner'],
                'mapWaste_clip': project['mapWaste_clip'],
                'mapNormal_take': project['mapNormal_take'],
                'mapGood_take': project['mapGood_take'],
                'mapFav_take': project['mapFav_take'],
                'cameraA': project['cameraA'],
                'cameraB': project['cameraB'],
                'cameraC': project['cameraC'],
                'cameraD': project['cameraD'],
                'libraryPageVisible': project['libraryPageVisible'],
                'livePageVisible': project['livePageVisible'],
            })

        return json.dumps(projects)
    else:
        abort(400)



def getOneProject(id):
    db = get_db()

    project = db.execute('SELECT * FROM projects WHERE id = ?', (id,)).fetchone()

    project = {
        'id': project['id'],
        'name': project['name'],
        'owner': project['owner'],
        'mapWaste_clip': project['mapWaste_clip'],
        'mapNormal_take': project['mapNormal_take'],
        'mapGood_take': project['mapGood_take'],
        'mapFav_take': project['mapFav_take'],
        'cameraA': project['cameraA'],
        'cameraB': project['cameraB'],
        'cameraC': project['cameraC'],
        'cameraD': project['cameraD'],
        'libraryPageVisible': project['libraryPageVisible'],
        'livePageVisible': project['livePageVisible'],
    }
    return project 
