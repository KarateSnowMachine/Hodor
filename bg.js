/* 
 *  
 * This file is part of Hodor.
 * 
 * Copyright 2012 Paul Rosenfeld
 * 
 * This code is released under a GPLv3 license. See the COPYING and LICENSE
 * files in this directory for more details. 
 * 
 */ 

function month_str_to_num(month) {
	months = {"Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, "Jul": 6, "Aug": 7, "Sep": 8,
		"Oct": 9, "Nov": 10, "Dec": 11};
	return months[month];
}
function airport_string_from_city(city) {
	if (city.indexOf("Miami") != -1 || city.indexOf("Lauderdale") != -1) {
		return "FLL,MIA";
	}
	if (city.indexOf("Canaveral") != -1) {
		return "MCO";
	}
	if (city.indexOf("Tampa") != -1) {
		return "TPA";
	}
	if (city.indexOf("Orleans") != -1) {
		return "MSY";
	}
	if (city.indexOf("San Juan") != -1) {
		return "SJU";
	}
	return "LAX"; 
}
function pad_number(n) {
	var x = new String(n);
	if (x.length == 1)
		return "0"+x;
	else
		return x
}

function get_time(time_str) {
	// FIXME: doesn't do minutes, but whatever
	
	var time_regex = /(\d{1,2})(:\d{2})?([ap]m)?/;
	var time_pieces = time_regex.exec(time_str); 
	var hour_int = parseInt(time_pieces[1]); 
	// minute_str = time_pieces[2];
	if (time_pieces[3] == "pm" && hour_int != 12) {
		hour_int += 12;
	}
	else if (time_pieces[3] == "am" && hour_int == 12) {
		hour_int = 0;
	}
	return pad_number(hour_int) + "00";
}

function format_date(d) {
	return d.getFullYear() + "-" + pad_number(d.getMonth()+1) + "-" + pad_number(d.getDate());
}

// XXX: edit the details of this function to customize your flight search; 
// 	in the 'ti' key, l=landing (i.e. arrival before), t=taking off (depart after)
function generate_google_flights_url(opts) {
	var fields = {"f": "BWI,IAD,DCA",
					"t": opts["airport"],
					"d": format_date(opts["departure_date"]),
					"r": format_date(opts["return_date"]),
					"ti": "l"+"0000"+"-"+get_time("12:00pm")+",t"+get_time("1:00pm")+"-"+"2400",
	}
	var base_string = "http://www.google.com/flights/#search"
		for (var key in fields) {
			base_string += ";"+key+"="+fields[key]
		}
	return base_string; 
}
function google_flights_date_from_carnival_string(date_str) {
	var date_regex = /([A-z]+)\s+(\d+)\s*,\s+(\d+).*/g;
	var matches = date_regex.exec(date_str);
	if (matches != null) {
		var month_int = month_str_to_num(matches[1]);
		var date_int = parseInt(matches[2]);
		var year_int = parseInt(matches[3]);
		var depart_date = new Date(year_int, month_int, date_int); 
		return depart_date;
	}
	else 
	{
		alert(date_str+" Failed to match!");
		return new Date(); 
	}

}
target_to_google_flights_tab_id = {}

// This is a debugging hook that one can trigger via the hodor button on a gflights tab 
test_gflight = function() {
	chrome.extension.sendMessage({"command":"find_cheapest"}, function(resp) { alert(resp) } );
}

chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (sender.tab.url.indexOf("carnival") > -1 && request.command == "find_cheapest") {
			chrome.tabs.create({'url': request.url, "active": false}, function(tab) { 
				var targetId = tab.id;

				chrome.tabs.onUpdated.addListener(function(tabId, changedProps) {
					if (tabId != targetId || changedProps.status != "complete")
						return;
					/* I don't have faith that the tab complete event for an ajaxified
					 * page such as the gflights page will fire correctly, so uh, as
					 * a hack/insurance add a half second delay before telling the
					 * gflights page to do the scrape operation. Ideally the
					 * gflights content script could figure out some way to fire
					 * once the page is finished, but that's potentially a lot of
					 * work and this hack will suffice for now */ 
					setTimeout(function() {
						console.log("gflights tab loaded -- sending request"); 
						chrome.tabs.sendMessage(tab.id, request, function (response) {
							console.log("bg: got response to find_cheapest"+response.prices);
							// send back to carnival page, can't use sendResponse() because of the asynchronous nature (i.e. the tab listener and the setTimeout call)
							chrome.tabs.sendMessage(sender.tab.id, response, function(response) {
								console.log("HODOR SUCCESS!");
							});
						}); 
					}, 2000); 
				}); 
			});
			}
			else if (sender.tab.url.indexOf("carnival") > -1 && request.command == "get_url") {
					var opts = {};
					var length = request["days"];
					var depart_from = airport_string_from_city(request["port"]);
					var date_str = request["date"];

					departure_date = google_flights_date_from_carnival_string(date_str);
					return_date = new Date(departure_date.getFullYear(), departure_date.getMonth(), departure_date.getDate()+length);
					opts["airport"] = depart_from;
					opts["departure_date"] = departure_date;
					opts["return_date"] = return_date;
					var gflights_url = generate_google_flights_url(opts);

				console.log("Got URL request from carnival page-- days:"+request["days"]+" port:"+request["port"]+ " date:"+request["date"] + "=>" + gflights_url);
				sendResponse({"url":gflights_url});
			}
});
console.log("hodor bg page loaded");
