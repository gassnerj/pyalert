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
print ()



mfs = data.getvalue("data")

lines = mfs.split(",")

alerts = Alert("https://api.weather.gov/alerts/active/")
nwsJson = alerts.requestJSON()

myId = []

for line in lines:
	ids = line.strip("[]\"")
	myId.append(ids)

env = Environment(
    loader=PackageLoader('alert', 'templates'),
    autoescape=select_autoescape(['html', 'xml'])
)

template = env.get_template('newAlerts.html')

for feature in nwsJson:
	if feature['properties']['id'] not in myId:
		ids = feature['properties']['id']
		event = feature['properties']['event']
		headline = feature['properties']['headline']
		expires = feature['properties']['expires']
		areaDesc = feature['properties']['areaDesc']
		geoCodes = feature['properties']['geocode']['UGC']
		for myevent in alerts.evs:
			if myevent == event:
				states = alerts.getZones(geoCodes)
				states = alerts.format_states(states)
				print(template.render(ids=ids, cssClass=event, headline=headline, expires=expires, areaDesc=areaDesc, event=event, new="new", state=states))
			else:
				pass
