import json
from moviepy.editor import *

class Covideo_Library:
    def __init__(self, projectId):
        self.projectId = projectId
        Library_File = open('flaskr/static/projects/project-' + projectId + '/.Covideo_library.json', 'r')
        Library = Library_File.read()
        Library = json.loads(Library)
        self.Library = Library

    def get(self):
        Library= self.Library
        for i in range(len(Library)):
            if Library[i]['clipname'] == "__init":
                del Library[i]
                break
        return Library

    def addEntry(self, entry):
        #Add empty string value for not defined keys
        keys = ['clipname','reel','scene', 'shot', 'take', 'comment', 'label', 'camera', 'cameraMeta']
        for key in keys:
            if key not in entry:
                entry[key] = ""
            elif entry[key] == None:
                entry[key] = ""
        self.Library.append(
            {
                "clipname" : entry['clipname'],
                "reel" : entry['reel'],
                "scene" : entry['scene'],
                "shot" : entry['shot'],
                "take" : entry['take'],
                "comment" : entry['comment'],
                "label" : entry['label'],
                "camera" : entry['camera'],
                "cameraMeta" : entry['cameraMeta'],
                "playbackfile": "",
                "thumbnail": "",
                "stills": []
            }
        )
        Library_File = open('flaskr/static/projects/project-' + self.projectId + '/.Covideo_library.json', 'w')
        Library_File.write(json.dumps(self.Library))
        Library_File.close()

    def deleteEntry(self, killentry):
        lib = self.Library
        lib[:] = [entry for entry in lib if entry['clipname'] != killentry['clipname']]


        Library_File = open('flaskr/static/projects/project-' + self.projectId + '/.Covideo_library.json', 'w')
        Library_File.write(json.dumps(lib))
        Library_File.close()

    def createThumb(self, filename, ext):
        clip = VideoFileClip('flaskr/static/projects/project-' + self.projectId + '/video/' + filename + '.' + ext)
        clip.save_frame('flaskr/static/projects/project-' + self.projectId + '/thumbs/' + filename + '.jpg', t=0)

    def searchEntry(self, clipname):
        for entry in self.Library:
            if entry['clipname'] == clipname:
                return entry

        return None

    def setMeta(self, clipname, key, value):
        entry = self.searchEntry(clipname)
        if value == None:
            value = ""
        if entry != None:
            entry[key] = value
            Library_File = open('flaskr/static/projects/project-' + self.projectId + '/.Covideo_library.json', 'w')
            Library_File.write(json.dumps(self.Library))
            Library_File.close()
            return True
        else:
            return False
