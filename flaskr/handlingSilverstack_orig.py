#import standard libraries
import os
import sys
import xml.etree.ElementTree as ET
from collections import OrderedDict
import requests
import json

# DEV Libararies

#import library Files

try:
    dom = ET.parse("Library.xml")
except FileNotFoundError:
    print('The file path you have given is not valid')
    sys.exit()
except:
    print("The given file is no XML File")
    sys.exit()

print('\n Safety notice: Only import XML files that you have created yourself using Silverstack. \n')

# Create a user object
userInfo = {
    "userName": "fabian",
    "password" : "075d419dfae28a268040eb074c3c707d32d03f9fba132d2a25c19bec2f893d5e"
}

# Create Object with all Project Infos
XMLprojectInfo = dom.find('Project')

projectInfo = {
    "Name": XMLprojectInfo.find('Name').text,
    "CreationDate" : XMLprojectInfo.get('creationDate'),
    "Cinematographer": XMLprojectInfo.find('Cinematographer').text,
    "DataWrangler": XMLprojectInfo.find('DataWrangler').text,
    "DigitalImageTechnician": XMLprojectInfo.find('DigitalImageTechnician').text,
    "Director": XMLprojectInfo.find('Director').text,
    "Location": XMLprojectInfo.find('Location').text,
    "Producer": XMLprojectInfo.find('Producer').text,
    "Production": XMLprojectInfo.find('Production').text,
}

#Print Project infos into CLI
print('--- PROJECT INFO ---')
print('Project Name: \t \t' + projectInfo['Name'])
print('Creation Date: \t \t' + projectInfo['CreationDate'])
print('Director: \t \t' + projectInfo['Director'])
print('Cinematographer: \t' + projectInfo['Cinematographer'])
print('DIT: \t \t \t' + projectInfo['DigitalImageTechnician'])
print('Data Manager: \t \t' + projectInfo['DataWrangler'])
print('Location: \t \t' + projectInfo['Location'])
print('Producer: \t \t' + projectInfo['Producer'])
print('Production: \t \t' + projectInfo['Production'])

# Create Video Clip list

media_library = []
thumbnailFiles = {}

XMLvideoClipList = dom.find('Folder').find('Content').findall('VideoClip')

for clip in XMLvideoClipList:
    videoClip = {
        "Name" : clip.find('ClipInfo').find('Name').text,
        "Duration" : clip.find('ClipInfo').find('Duration').text,
        "Episode" : clip.find('SlateInfo').find('Episode').text,
        "Scene" : clip.find('SlateInfo').find('Scene').text,
        "Shot" : clip.find('SlateInfo').find('Shot').text,
        "Take" : clip.find('SlateInfo').find('Take').text,
        "Camera" : clip.find('SlateInfo').find('Camera').text,
        "Label" : clip.find('UserInfo').find('Label').text,
        "Comment" : clip.find('UserInfo').find('Comment').text,
        "Flagged" : clip.find('UserInfo').find('Flagged').text,
        "Camera" : {
            "Manufacturer" : clip.find('Recorder').find('Manufacturer').text,
            "Model" : clip.find('Recorder').find('Model').text,
            "Serial" : clip.find('Recorder').find('DeviceID').text,
            "FirmwareVersion" : clip.find('Recorder').find('FirmwareVersion').text,
            "ASA" : clip.find('Settings').find('ASA').text,
            "Whitepoint" : clip.find('Settings').find('Whitepoint').text,
            "Tint" : clip.find('Settings').find('Tint').text,
            "FStop" : clip.find('Settings').find('FStop').text,
            "TStop" : clip.find('Settings').find('TStop').text,
            "Shutter" : clip.find('Settings').find('Shutter').text,
            "SensorFPS" : clip.find('Settings').find('SensorFPS').text,
            "IntFilter" : clip.find('Settings').find('Filter').text,
            "Lens" : clip.find('Settings').find('Lens').text,
            "DistanceToObject" : clip.find('Settings').find('DistanceToObject').text,
            "LookName" : clip.find('Processing').find('LookName').text,
            "Anamorphic" : clip.find('Processing').find('Anamorphic').text,
            "Flip" : clip.find('Processing').find('Flip').text,
        },
        "Format": {
            "Codec" : clip.find('Format').find('Codec').text,
            "FileType" : clip.find('Format').find('FileType').text,
            "Resolution" : clip.find('Format').find('Resolution').text,
            "FPS" : clip.find('Format').find('FPS').text,
            "ColorSpace" : clip.find('Format').find('ColorSpace').text,
        },
        "Resources" : [],
        "ShootingDate" : clip.find('SlateInfo').find('ShootingDate').text,
        "StartTC" : clip.find('Timecode').find('StartTC').text,
        "EndTC" : clip.find('Timecode').find('EndTC').text,
        "Reel" : clip.find('Timecode').find('ReelTapeName').text,
        "LibraryPath" : clip.find('LibraryPath').text,
        "ThumbnailFile" : os.path.basename(clip.find('PosterPath').text)
    }
    resources = clip.find("Resources")
    for resource in resources:
        if resource.find("SourceOfCopyTasks") == "NO":
            videoClip.Resources.append(resource.find("VolumeName"))
    media_library.append(videoClip)
    #thumbnailFiles[videoClip['ThumbnailFile']] = open(clip.find('PosterPath').text, "rb")



print(media_library[0]['Name'])
sendRequest = requests.post("http://127.0.0.1:5000/metauploader", json = json.dumps({"projectInfo" : projectInfo, "media_library" : media_library, "userInfo" : userInfo }))
print(sendRequest.status_code)
print(sendRequest.content)
print(sendRequest.headers)
sendRequest.close()
