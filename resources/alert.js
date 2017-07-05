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

	mkTableArray: function(mode) {
		var myTableArray = [];
		var arrayOfThisRow = [];
		$("#alerts").each(function() {
			
			var tableData = $(this).find('li');
			if (tableData.length > 0) {
				tableData.each(function() {
					if (mode == "checkid") {
						arrayOfThisRow.push($(this).attr("id"));
					} else if (mode == "checkexpiry") {
						arrayOfThisRow.push($(this).attr("expiration"));
					} else if (mode == "news") {
						if ($(this).hasClass("new")) {
							arrayOfThisRow.push($(this).attr("id"))
						}
					}
				});
				myTableArray.push(arrayOfThisRow);
			}
		});
		var myJson = JSON.stringify(myTableArray);
		
		if (mode == "checkid") {
			return myJson;
		} else if (mode == "checkexpiry") {
			return arrayOfThisRow;
		} else if (mode == "news") {
			return arrayOfThisRow;
		}
	},

	expireAlerts: function() {
		var curTime = Date.parse(Date());
		var myTableArray = this.mkTableArray("checkexpiry");
		for (i = 0; i < myTableArray.length; i++) {
			expiry = Date.parse(myTableArray[i]);
			if (expiry < curTime) {
				var searchString = expiry;
				try {
					var selector1 = "[expiration=\""+myTableArray[i]+"\"]";
						$(selector1).each(function() {
								$(this).fadeOut(2000);
						});
				} catch (err) {
					//do nothing
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
	data = Alert.mkTableArray("checkid");

	$.post( "fetchNew.py", {data}, function(data) {
		$("#alerts").prepend(data);
		$(".new").hide().fadeIn(1000);
		var news = Alert.mkTableArray("news");
		for (i=0; i < news.length; i++) {
			var id = "#" + news[i];
			var event = $(id).attr("event");
			var areaDesc = $(id).attr("areaDesc");
			if (event != undefined && event == "Tornado Warning" || event == "Severe Thunderstorm Warning") {
				Push.create(event, {
					body: "A " + event + " has been issued for " + areaDesc,
					timeout: 5000,
					link: "/",
					onClick: function() {
						window.focus();
						this.close();
					}
				});
			}
		}

		$("li").removeClass("new");

	});
}

$(document).ready(function() {

	initMap();
	$("#testing").click(function() {
		fetchNewAlerts();
	});
	
	//Alert.loadDoc(url);

	//createCookie('loaded', 'true', 7);

	setInterval("fetchNewAlerts()", refreshRate);
	setInterval("Alert.expireAlerts()", 1000);
	setInterval("clearExpiredFromHidden()", 300000);
	
	
	
	//$('#my_popup').popup();
	
	$("#alerts").on("click", ">li", function(){
	    var passThis = $(this).attr('id');
	    var coords = $(this).attr('coords');
	    var center = $(this).attr('center');
	    var color = $(this).attr('color');
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


