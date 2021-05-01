import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from passlib.hash import sha256_crypt

from flaskr.db import get_db
import json

bp = Blueprint('settings', __name__, url_prefix='/settings')


@bp.route('/', methods=('GET', 'POST'))
def settings():
    if request.method == 'GET':
        return render_template('app/settings.html')
    else:
        print(request.form)
        return render_template('app/settings.html')


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
            cursor = db.cursor()
            cursor.execute(
                'INSERT INTO users (userName, password, userGroup, name, eMail, phone, billing, maxGB, maxProjectNumber, expirationDate, liveStreamPlugin, avatar) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                (data['userName'], sha256_crypt.encrypt(data['password']), data['userGroup'], data['name'], data['eMail'], data['phone'],
                 data['billing'], data['maxGB'], data['maxProjectNumber'], data['expirationDate'], data['liveStreamPlugin'], '',)
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
            cursor = db.cursor()
            cursor.execute(
                'UPDATE users SET userName = ?, userGroup = ?, name = ?, eMail = ?, phone = ?, billing=?, maxGB=?, maxProjectNumber = ?, expirationDate= ?, liveStreamPlugin = ?, avatar = ? WHERE id = ?',
                (data['userName'], data['userGroup'], data['name'], data['eMail'], data['phone'], data['billing'],
                 data['maxGB'], data['maxProjectNumber'], data['expirationDate'], data['liveStreamPlugin'], '', data['id'])
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
 
