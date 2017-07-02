#!/usr/bin/python3

from jinja2 import Environment, PackageLoader, select_autoescape
from alert import Alert
import cgi
import cgitb
cgitb.enable()

env = Environment(
    loader=PackageLoader('alert', 'templates'),
    autoescape=select_autoescape(['html', 'xml'])
)

alerts = Alert("https://api.weather.gov/alerts/active/")

parJson = alerts.requestJSON()



h1Title = "Watches, warnings, and advisories"

template_header = env.get_template('thon.html')

template_content = env.get_template("newAlerts.html")

template_footer = env.get_template("footer.html")

title = "Thunder Chasers Alerts - Home"

print ("Content-Type: text/html")
print ()

evs = ['Severe Thunderstorm Warning', 'Tornado Warning', 'Flash Flood Warning', 'Special Weather Statement']

print(template_header.render(title=title))

states = []
for feature in parJson:
	ids = feature['properties']['id']
	event = feature['properties']['event']
	headline = feature['properties']['headline']
	expires = feature['properties']['expires']
	areaDesc = feature['properties']['areaDesc']
	geoCodes = feature['properties']['geocode']['UGC']



	for myevent in evs:
		if myevent == event:
			states = alerts.getZones(geoCodes)
			states = str(states)
			states = states.strip("[]")
			states = states.replace("'", "")
			print(template_content.render(ids=ids, cssClass=event, headline=headline, expires=expires, areaDesc=areaDesc, event=event, state=states))
		else:
			pass

print(template_footer.render())