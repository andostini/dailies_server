from os import environ
import jwt
from flaskr.db import get_db

def validate(access_token, min_user_group=10, project_token=None, related_project=None, related_user=None):
    ## CHECK IF TOKEN IS VALID AND RETURN USER OBJECT
    claimant = None
    try:
        claimant = jwt.decode(access_token, environ["SECRET"], algorithms=["HS256"])
    except: 
        ## Auth for people without user account who watch individual projects only (Viewers)
        if project_token and min_user_group >= 10:
            try:
                claimant = jwt.decode(project_token, environ["SECRET"], algorithms=["HS256"])
                if related_project in claimant["projects"]:
                    return True
            except:
                return False
    else:
        ## Working with the access_token for registered users
        if claimant["userGroup"] == 0:
            return claimant  
            ##Super Admin authenticated
            
        if claimant["userGroup"] <= min_user_group:
            if related_project:
                db = get_db();
                project = db.execute(
                    'SELECT Owner FROM projects WHERE id = ?', (related_project,)
                ).fetchone()
                if project["owner"] == claimant["id"]:
                    return claimant
                    ## related project belongs to claimant
            elif related_user:
                related_user = int(related_user)
                claimant['id'] = int(claimant['id'])
                print(related_user == claimant["id"])
                if related_user == claimant["id"]:
                    return claimant
                ##related user is claimant

            elif related_project == None and related_user == None:
                return claimant
                ## no related project or user given. Being in User Group is enough

        if project_token and min_user_group >= 10:
            ## Sorry for double Coding
            ## if user is signed up (and therefor has valid access token) but has viewer rights to someone elses project
            try:
                claimant = jwt.decode(project_token, environ["SECRET"], algorithms=["HS256"])
                if related_project in claimant["projects"]:
                    return claimant
            except:
                return False
    
    return False

def getUserInfo(token):
    try:
        claimant = jwt.decode(token, environ["SECRET"], algorithms=["HS256"])
        return claimant
    except:
        return False


def devalidate(type, token):
    if type(token) == "str":
        db = get_db()
        cursor = db.cursor()
        #cursor.execute(
        #    'INSERT INTO usedTokens (type, token) VALUES (?,?)',
        #    (type, token)
        #).fetchone()
        # db.commit()

    return True
    

def update():
    pass
    ## CREATE NEW TOKEN WHEN INFORMATION IS RENEWED