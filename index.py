#!/usr/bin/python3

from jinja2 import Environment, PackageLoader, select_autoescape
from alert import Alert

env = Environment(
    loader=PackageLoader('alert', 'templates'),
    autoescape=select_autoescape(['html', 'xml'])
)

alerts = Alert("https://api.weather.gov/alerts/active/area/TX")

parJson = alerts.requestJSON()

template = env.get_template('thon.html')

title = "Home"

print(template.render(title=title, items=parJson))