#!/usr/bin/python3

from alert import Alert
import cgi
import cgitb
cgitb.enable()
import json
import requests
from jinja2 import Environment, PackageLoader, select_autoescape

data = cgi.FieldStorage()

print ("Content-Type: text/html")
print ("")

alerts = Alert("https://api.weather.gov/alerts/active/")
nwsJson = alerts.requestJSON()

items = {}

jsonString = data['data'].value

for feature in nwsJson:
	for element in jsonString:
		for item in element:
			print(item)



"""
for element in jsonParsed:
	for feature in nwsJson:
		for item in element:
			fid = feature['properties']['id']
			if (fid != item):
				print(fid)
				items['id'] = feature['properties']['id']
				items['headline'] = feature['properties']['headline']
"""


#env = Environment(
#    loader=PackageLoader('alert', 'templates'),
#    autoescape=select_autoescape(['html', 'xml'])
#)

#template = env.get_template('newAlerts.html')

#print(template.render(item=items))