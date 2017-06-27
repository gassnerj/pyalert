#!/usr/bin/python3

import json
import os
import requests

class Alert(object):

    def __init__(self, url):
        self.url = url

    def requestJSON(self):
        url = self.url
        resp = requests.get(url=url)
        data = json.loads(resp.text)
        if 'features' in data:
            parsedJson = data['features']
            return parsedJson
        else:
            parsedJson = data['properties']
            return parsedJson

    def printJSON(self):
        parsedJson = self.requestJSON()
        print (json.dumps(parsedJson, indent=4, sort_keys=True))
