#!/usr/bin/python3

from alert import Alert
import cgi
import cgitb
cgitb.enable()
import json
import requests
import re
import random
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
	i = random.randint(1, 1000)
	if feature['properties']['id'] not in myId:
		ids = feature['properties']['id']
		event = feature['properties']['event']
		headline = feature['properties']['headline']
		expires = feature['properties']['expires']
		areaDesc = feature['properties']['areaDesc']
		geoCodes = feature['properties']['geocode']['UGC']
		description = feature['properties']['description']
		instruction = feature['properties']['instruction']
		if event == "Severe Thunderstorm Warning" or event == "Tornado Warning" or event == "Flash Flood Warning" or event == "Flood Warning":
	
			coords = feature['geometry']['coordinates']
			for coord in coords:
				coord = str(coord)
				#coord = coord.replace("[", "{lng:")
				#coord = coord.replace("]", "}")
				#coord = coord.replace(", ", ", lat:")
				rplc = "^\[{1}|\]{1}$"
	
				coords = coord.split("[, [")
	
				for c in coords:
					c = str(c)
					ncoord = re.sub(rplc, '', c)
					ncoord = ncoord.replace("[", "{lng: ")
					ncoord = ncoord.replace("]", "}")
					ncoord = ncoord.replace(", ", ", lat: ")
					ncoord = ncoord.replace(", lat: {", ", {")
					#print(ncoord)
			if event == "Severe Thunderstorm Warning":
				color = "\"#f4ec04\""
			elif event == "Tornado Warning":
				color = "\"#e20202\""
			elif event == "Flood Warning":
				color = "\"#048202\""
			elif event == "Flash Flood Warning":
				color = "\"#08f404\""
		else:
			ncoord = ''
			color = "\"#ffffff\""
			
		for myevent in alerts.evs:
			if myevent == event:
				states = alerts.getZones(geoCodes)
				states = alerts.format_states(states)
				print(template.render(coords=ncoord, color=color, instruction=instruction, description=description, i=i, ids=ids, cssClass=event, headline=headline, expires=expires, areaDesc=areaDesc, event=event, new="new", state=states))
			else:
				pass
