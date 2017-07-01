#!/usr/bin/python3

import json
import os
import requests


class Alert(object):
	"""A class to retrieve data from the NWS Weather API."""
	def __init__(self, url):
		self.url = url

	def requestJSON(self):
		url = self.url
		resp = requests.get(url = url)
		data = json.loads(resp.text)
		if 'features' in data:
			parsedJson = data['features']
			return parsedJson
		else :
			parsedJson = data['properties']
			return parsedJson
	def filterJSON(self, events, jsonString):
		for feature in jsonString:
			for event in events:
				if event == feature['properties']['event']:
					pass
		#filter by event type
		pass
	def printJSON(self):
		parsedJson = self.requestJSON()
		print(json.dumps(parsedJson, indent = 4, sort_keys = True))

	def getState(self, geoCode):
		us_state_abbrev = {
		'Alabama': 'AL',
		'Alaska': 'AK',
		'Arizona': 'AZ',
		'Arkansas': 'AR',
		'California': 'CA',
		'Colorado': 'CO',
		'Connecticut': 'CT',
		'Delaware': 'DE',
		'Florida': 'FL',
		'Georgia': 'GA',
		'Hawaii': 'HI',
		'Idaho': 'ID',
		'Illinois': 'IL',
		'Indiana': 'IN',
		'Iowa': 'IA',
		'Kansas': 'KS',
		'Kentucky': 'KY',
		'Louisiana': 'LA',
		'Maine': 'ME',
		'Maryland': 'MD',
		'Massachusetts': 'MA',
		'Michigan': 'MI',
		'Minnesota': 'MN',
		'Mississippi': 'MS',
		'Missouri': 'MO',
		'Montana': 'MT',
		'Nebraska': 'NE',
		'Nevada': 'NV',
		'New Hampshire': 'NH',
		'New Jersey': 'NJ',
		'New Mexico': 'NM',
		'New York': 'NY',
		'North Carolina': 'NC',
		'North Dakota': 'ND',
		'Ohio': 'OH',
		'Oklahoma': 'OK',
		'Oregon': 'OR',
		'Pennsylvania': 'PA',
		'Rhode Island': 'RI',
		'South Carolina': 'SC',
		'South Dakota': 'SD',
		'Tennessee': 'TN',
		'Texas': 'TX',
		'Utah': 'UT',
		'Vermont': 'VT',
		'Virginia': 'VA',
		'Washington': 'WA',
		'West Virginia': 'WV',
		'Wisconsin': 'WI',
		'Wyoming': 'WY',
		}
		states = res = {v:k for k,v in us_state_abbrev.items()}

		for k, v in states.items():
			code = str(k)
			st = geoCode
			if st.startswith(code):
				return v

	def getZones(self, getZones):
		zones = json.loads(open("resources/zones.json").read())
		parsedZones = zones['features']

		states = []
		for ugcCode in getZones:
			for element in parsedZones:
				ugc = element['properties']['id']
				#print(ugc)
				if element['properties']['state'] is None:
					state = "Coastal Waters"
				else:
					state = element['properties']['state']
				if ugcCode == ugc:
					states.append(state)
					break
		states = list(set(states))
		
		for code in states:
			state_names = self.getState(code)
		
		return state_names
				



