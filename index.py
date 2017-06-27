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

template = env.get_template('thon.html')

title = "Home"
print ("Content-Type: text/html")
print ("")
print(template.render(title=title, items=parJson))