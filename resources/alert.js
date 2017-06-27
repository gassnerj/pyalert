var jsonAlerts;
var url = "https://api.weather.gov/alerts?active=1&zone_type=land";

var refreshRatesec = 60;
var refreshRate = refreshRatesec * 1000;

function createCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}

var Alert = {

	loadDoc: function(url) {

		var xhttp = new XMLHttpRequest();
		var x;
		var alertObj;
		var i;
		var n = 0;
		var table = document.getElementById("alerts");
		var curTime = Date.parse(Date());
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				alertObj = JSON.parse(this.responseText);
				document.getElementById("title").innerHTML = alertObj['title'];
				for (i = 0; i < alertObj.features.length; i++) {
					x = alertObj.features[i];
					var alertID = x['properties'].id;
					var expiry = Date.parse(x['properties'].expires);
					var status = x['properties'].status;
					var event = x['properties'].event;
					var areaDesc = x['properties'].areaDesc;
					var torDetect = x['properties']['parameters'].tornadoDetection;
					var a_p = "";
					var d = new Date(expiry);
					var curr_hour = d.getHours();
					var curr_day = d.getDate();
					var curr_month = d.getMonth();
					curr_month++;
					var curr_year = d.getFullYear();
					
					var until = x['properties'].expires;
					var ck = readCookie('loaded');


					var selector = "#alerts";


					if (curr_hour < 12) {
						a_p = "AM";
					} else {
						a_p = "PM";
					}
					if (curr_hour == 0) {
						curr_hour = 12;
					}
					if (curr_hour > 12) {
						curr_hour = curr_hour - 12;
					}
					var curr_min = d.getMinutes();
					curr_min = curr_min + "";
					if (curr_min.length == 1) {
						curr_min = "0" + curr_min;
					}
					var expireText = " until " + curr_month + "/" + curr_day + "/" + curr_year + " at " + curr_hour + ":" + curr_min + " " + a_p;
					
					if (document.getElementById(alertID)) {
						//do nothing
					} else {
						switch (event) {
							case "Severe Thunderstorm Warning":
								if (ck == true) {
									$(selector).prepend('<li id="' + alertID + '" class="my_popup_open thunderstorm" expiration="' + expiry + '"><strong>' + event + '</strong> for ' + areaDesc + ' ' + expireText + '</li>').hide().fadeIn(1000);
									Push.create("Severe Thunderstorm Warning!", {
										body: "A severe thunderstorm warning has been issued for " + areaDesc,
										requireInteraction: true,
										link: "/",
										onClick: function() {
											window.focus();
											this.close();
										}
									});
								} else {
									$(selector).append('<li id="' + alertID + '" class="my_popup_open thunderstorm" expiration="' + expiry + '"><strong>' + event + '</strong> for ' + areaDesc + ' ' + expireText + '</li>').hide().fadeIn(1000);

								}
								break;
							case "Tornado Warning":
								if (ck == true) {
									if (torDetect == "RADAR INDICATED") {
										var torClass = "tornado";
									} else if (torDetect == "SPOTTER INDICATED") {
										var torClass = "confirmed";
									}
									$(selector).prepend('<li id="' + alertID + '" class="my_popup_open '+torClass+'" expiration="' + expiry + '"><strong>' + event + '</strong> for ' + areaDesc + ' ' + expireText + '</li>').hide().fadeIn(1000);
									Push.create("Tornado Warning!", {
										body: "A tornado warning has been issued for " + areaDesc,
										requireInteraction: true,
										link: "/",
										vibrate: [100, 100, 100],
										onClick: function() {
											window.focus();
											this.close();
										}
									});
								} else {
									$(selector).append('<li id="' + alertID + '" class="my_popup_open tornado" expiration="' + expiry + '"><strong>' + event + '</strong> for ' + areaDesc + ' ' + expireText + '</li>').hide().fadeIn(1000);

								}
								break;
							case "Severe Thunderstorm Watch":
								if (ck == true) {
									$(selector).prepend('<li id="' + alertID + '" class="my_popup_open severewatch" expiration="' + expiry + '"><strong>' + event + '</strong> for ' + areaDesc + ' ' + expireText + '</li>').hide().fadeIn(1000);

								} else {
									$(selector).append('<li id="' + alertID + '" class="my_popup_open severewatch" expiration="' + expiry + '"><strong>' + event + '</strong> for ' + areaDesc + ' ' + expireText + '</li>').hide().fadeIn(1000);

								}
								break;
							case "Tornado Watch":
								if (ck == true) {
									$(selector).prepend('<li id="' + alertID + '" class="my_popup_open torwatch" expiration="' + expiry + '"><strong>' + event + '</strong> for ' + areaDesc + ' ' + expireText + '</li>').hide().fadeIn(1000);

								} else {
									$(selector).append('<li id="' + alertID + '" class="my_popup_open torwatch" expiration="' + expiry + '"><strong>' + event + '</strong> for ' + areaDesc + ' ' + expireText + '</li>').hide().fadeIn(1000);
								}
								break;
							case "Tropical Storm Warning":
								if (ck == true) {
									$(selector).prepend('<li id="' + alertID + '" class="my_popup_open tropwarn" expiration="' + expiry + '"><strong>' + event + '</strong> for ' + areaDesc + ' ' + expireText + '</li>').hide().fadeIn(1000);

								} else {
									$(selector).append('<li id="' + alertID + '" class="my_popup_open tropwarn" expiration="' + expiry + '"><strong>' + event + '</strong> for ' + areaDesc + ' ' + expireText + '</li>').hide().fadeIn(1000);

								}
								break;
							case "Flood Warning":
								if ($("#fwchbx").is(':checked')) {} else {
									$(".fw").remove();
								}
								break;
							case "Special Weather Statement":
								if (document.getElementById("swschbx").checked) {} else {
									$(".sps").remove();
								}
								break;
							case "Test Message":
								break;
							default:
								if (ck == true) {
									$(selector).prepend('<li id="' + alertID + '" class="my_popup_open" expiration="' + expiry + '"><strong>' + event + '</strong> for ' + areaDesc + ' ' + expireText + '</li>').hide().fadeIn(1000);
									Push.create(event, {
										body: "A " + event + " has been issued for " + areaDesc,
										timeout: 5000,
										link: "/",
										onClick: function() {
											window.focus();
											this.close();
										}
									});
								} else {
									$(selector).append('<li id="' + alertID + '" class="my_popup_open" expiration="' + expiry + '"><strong>' + event + '</strong> for ' + areaDesc + ' ' + expireText + '</li>').hide().fadeIn(1000);

								}
						}
					}
				}
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
		eraseCookie('loaded');
	},

	mkTableArray: function() {
		var myTableArray = [];
		$("#alerts").each(function() {
			var arrayOfThisRow = [];
			var tableData = $(this).find('li');
			if (tableData.length > 0) {
				tableData.each(function() {
					arrayOfThisRow.push($(this).attr("id"));
				});
				myTableArray.push(arrayOfThisRow);
			}
		});
		var myJson = JSON.stringify(myTableArray);
		return myJson;
	},

	expireAlerts: function() {
		var curTime = Date.parse(Date());
		var myTableArray = this.mkTableArray();
		for (i = 0; i < myTableArray.length; i++) {
			var expiry = myTableArray[i];
			for (y = 0; y < expiry.length; y++) {
				var exp = expiry[y];
				if (exp < curTime) {
					var searchString = exp;
					try {
						var selector1 = "[expiration="+exp+"]";
							$(selector1).each(function() {
									$(this).fadeOut(2000);
							});
					} catch (err) {
						//do nothing
					}

				}
			}

		}
	},

	removeAlerts: function() {
		$("#alerts").fadeOut(500);

		$("ul#alerts li.my_popup_open").each(function() {
			$(this).remove();
		});
	},
	
	
	
	loadDetails: function(alertID) {
		alertID = "https://api.weather.gov/alerts/" + alertID;

		var xhttp2 = new XMLHttpRequest();
		var alertObj2;
		var x;
		var i;
		var n = 0;

		xhttp2.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				alertObj2 = JSON.parse(this.responseText);

				document.getElementById("alertHeadline").innerHTML = alertObj2['properties'].headline;
				document.getElementById("alertDescription").innerHTML = alertObj2['properties'].description;
				document.getElementById("alertResponse").innerHTML = alertObj2['properties'].instruction;

				if (alertObj2['properties'].event != "Severe Thunderstorm Warning") {
					document.getElementById("params").setAttribute("style", "display:none;");
				} else {
					document.getElementById("params").setAttribute("style", "display:block;");
				}

				if (alertObj2['properties']['parameters'].hailSize) {
					document.getElementById("hailSize").innerHTML = alertObj2['properties']['parameters'].hailSize + " inch(es)";
				}
				if (alertObj2['properties']['parameters'].windGust) {
					document.getElementById("windGust").innerHTML = alertObj2['properties']['parameters'].windGust + " MPH";
				}


				for (i = 0; i < alertObj2.properties.length; i++) {
					x = alertObj2.properties[i];
					if (1 == 1) {
						n++;
						alert(alertObj2.event);

					} else {

						alert("Warning " + x['properties'].id + " expired.");

					}
				}
			}
		};
		xhttp2.open("GET", alertID, true);
		xhttp2.send();
	}

}

function clearExpiredFromHidden() {
	$('li[style*="display: none"]').each(function() {
		$(this).remove();
	});
}

function fetchNewAlerts() {
	data = Alert.mkTableArray();
	$.post( "fetchNew.py", {data}, function(data) {
		$("#alerts").prepend(data);
		$(".new").hide().fadeIn(1000);
	});
}

$(document).ready(function() {
	
	$("#testing").click(function() {
		fetchNewAlerts();
	})
	
	//Alert.loadDoc(url);

	//createCookie('loaded', 'true', 7);

	//setInterval("fetchNewAlerts()", refreshRate);
	//setInterval("Alert.expireAlerts()", 1000);
	//setInterval("clearExpiredFromHidden()", 300000);
	
	
	
	$('#my_popup').popup();
	
	$("#alerts").on("click", ">li", function(){
	    var passThis = $(this).attr('id');
	    Alert.loadDetails(passThis);
	});
	
	$('#state').on('change', function() {
		createCookie('loaded', 'true', 7);
		var state = $(this).val();
		if (state == "ALL") {
			url = "https://api.weather.gov/alerts?active=1&zone_type=land";
		} else {
			url = "https://api.weather.gov/alerts/active/area/" + state + "/";
		}
		loadCounties(state);
		Alert.removeAlerts();
		Alert.loadDoc(url);
	});
	
	$("#fwchbx").on('change', function() {
		if (!$(this).is(':checked')) {
			$('#fwchbx').prop('checked', false);
			Alert.loadDoc(url);
		} else {
			$('#fwchbx').prop('checked', true);
			Alert.loadDoc(url);
		}

	});

});



function removeOptions(selectbox) {
		var i;
		for (i = selectbox.options.length - 1; i >= 0; i--) {
			selectbox.remove(i);
		}
	}
	//using the function:


function loadCounties(state) {

	//var state = selObj.value;
	//var url = "https://api.weather.gov/alerts/active/area/" + state + "/";
	alertID = "zones.json";

	var xhttp3 = new XMLHttpRequest();
	var alertObj3;
	var x;
	var i;
	var n = 0;
	removeOptions(document.getElementById("counties"));
	xhttp3.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			alertObj3 = JSON.parse(this.responseText);

			for (i = 0; i < alertObj3.features.length; i++) {
				x = alertObj3.features[i];
				if (x['properties'].state == state) {
					var sel = document.getElementById("counties");
					var opt = document.createElement("option");
					opt.textContent = x['properties'].name;
					sel.add(opt);
				}
			}
		}
	};
	xhttp3.open("GET", alertID, true);
	xhttp3.send();
}


/*function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {
      lat: 48.75,
      lng: -108.26
    },
    mapTypeId: 'terrain'
  });

  var flightPlanCoordinates = [{
    lng: -108.26,
    lat: 48.75
  }, {
    lng: -108.32,
    lat: 48.74
  }, {
    lng: -108.35,
    lat: 48.44
  }, {
    lng: -108.42,
    lat: 48.44
  }, {
    lng: -108.43,
    lat: 48.98
  }, {
    lng: -108.6,
    lat: 47.99
  }, {
    lng: -108.64,
    lat: 47.92
  }];
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);
}*/