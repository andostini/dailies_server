#import standard libraries
import os
import sys
import xml.etree.ElementTree as ET
from collections import OrderedDict
import requests
import json

# DEV Libararies

#import library Files


class silverstack:
    def __init__(self, file, labelMapping):
        try:
            self.dom = ET.parse(file)
        except:
            self.dom = False
        self.labelMapping = labelMapping
        self.validLabels = {'waste_clip', 'normal_take', 'good_take', 'fav_take'}

    def getProjectInfo(self):
        XMLprojectInfo = self.dom.find('Project')

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

        return projectInfo

    def getMetaObject(self):
        if self.dom:
            XMLvideoClipList = self.dom.find('Folder').find('Content').findall('VideoClip')
            clips = []
            labelMapping = self.labelMapping
            for clip in XMLvideoClipList:
                videoClip = {
                    "clipname" : clip.find('ClipInfo').find('Name').text,
                    "reel" : clip.find('Timecode').find('ReelTapeName').text,
                    "scene" : clip.find('SlateInfo').find('Scene').text,
                    "shot" : clip.find('SlateInfo').find('Shot').text,
                    "take" : clip.find('SlateInfo').find('Take').text,
                    "comment" : clip.find('UserInfo').find('Comment').text,
                    "cameraMeta" : {
                            'Clip Info' : {
                                "Duration" : clip.find('ClipInfo').find('Duration').text,
                                "Flagged" : clip.find('UserInfo').find('Flagged').text,
                                "ShootingDate" : clip.find('SlateInfo').find('ShootingDate').text,
                                "StartTC" : clip.find('Timecode').find('StartTC').text,
                                "EndTC" : clip.find('Timecode').find('EndTC').text
                            },
                            'Settings' : {
                                "ASA" : clip.find('CameraSettings').find('EI_ISO_ASA').text,
                                "Whitepoint" : clip.find('CameraSettings').find('WhiteBalance').text,
                                "Tint" : clip.find('CameraSettings').find('Tint').text,
                                "FStop" : clip.find('CameraSettings').find('FStop').text,
                                "TStop" : clip.find('CameraSettings').find('TStop').text,
                                "Shutter" : clip.find('CameraSettings').find('Shutter').text,
                                "SensorFPS" : clip.find('CameraSettings').find('SensorFPS').text,
                                "IntFilter" : clip.find('CameraSettings').find('Filter').text,
                                "Lens" : clip.find('CameraSettings').find('Lens').text,
                                "DistanceToObject" : clip.find('CameraSettings').find('DistanceToObject').text
                            },
                            'Format' : {
                                "Codec" : clip.find('Format').find('Codec').text,
                                "FileType" : clip.find('Format').find('FileType').text,
                                "Resolution" : clip.find('Format').find('Resolution').text,
                                "FPS" : clip.find('Format').find('FPS').text,
                                "ColorSpace" : clip.find('Format').find('ColorSpace').text,
                            },
                            'Processing' : {
                                "LookName" : clip.find('Processing').find('LookName').text,
                                "Anamorphic" : clip.find('Processing').find('Anamorphic').text,
                                "Flip" : clip.find('Processing').find('Flip').text,
                            },
                            'Camera' : {
                                "Manufacturer" : clip.find('Recorder').find('Manufacturer').text,
                                "Model" : clip.find('Recorder').find('Model').text,
                                "Serial" : clip.find('Recorder').find('DeviceID').text,
                                "FirmwareVersion" : clip.find('Recorder').find('FirmwareVersion').text
                            }

                        },
                    "label" : clip.find('UserInfo').find('Label').text,
                    "camera" : clip.find('SlateInfo').find('Camera').text
                }

                if videoClip['label'] == labelMapping['waste_clip']: videoClip['label'] = 'waste_clip'
                elif videoClip['label'] == labelMapping['normal_take']: videoClip['label'] = 'normal_take'
                elif videoClip['label'] == labelMapping['good_take']: videoClip['label'] = 'good_take'
                elif videoClip['label'] == labelMapping['fav_take']: videoClip['label'] = 'fav_take'
                if videoClip['label'] not in self.validLabels:
                    videoClip['label'] = ""

                videoClip['cameraMeta'] = json.dumps(videoClip['cameraMeta'])
                clips.append(videoClip)

            return clips
        else:
            return False
