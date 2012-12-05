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


/* A lot of this stuff is from old code -- the trigger is the last line of this
 * file (basically an onload event for the popup that sends a message to the
 * selected tab 
 * */ 

var assumptions = { "airport": "BWI,IAD,DCA", "year": 2013, "arrive_by": "12:00pm", "depart_after": "1:00pm" } 


function hodor_log(text, error) {
	e = document.getElementById("hodorLog");
	tmp = e.innerHTML;
	if (error) {
		text = "<font color='red'>"+text+"</font>"
	}
	e.innerHTML = text + "<br>" + tmp;
}
function update_icon(success) {
	e = document.getElementById("status_icon"); 
	icon_filename="icon_fail_128.png";
	if (success) {
		icon_filename="icon_success_128.png";
	}
	e.src=icon_filename;
}

function print_assumptions() {
	e = document.getElementById("hodorAssumptions"); 
	e.innerHTML += "<ul>";
	e.innerHTML += "<li> Airport: "+assumptions["airport"] +"</li>";
	e.innerHTML += "<li> Year: "+assumptions["year"] +"</li>";
	e.innerHTML += "<li> Arrive By: "+assumptions["arrive_by"] +"</li>";
	e.innerHTML += "<li> Leave After: "+assumptions["depart_after"] +"</li>";
	e.innerHTML += "</ul>";
}



document.addEventListener('DOMContentLoaded', function () {
chrome.tabs.getSelected(null, function (tab) {
	// Trigger URL generation for carnival cruises on the carnival tab
	if (tab.url.indexOf("carnival") > -1) {
		chrome.tabs.sendMessage(tab.id, {command: "go"}, function(resp) {console.log("response from carnival page"+resp) } );
	}

	// This for debugging purposes (to trigger the scrape script without having to load the carnival page at all"); 
	else if (tab.url.indexOf("google") > -1) {
	alert("debugging hook for find_cheapest"); 
		chrome.tabs.sendMessage(tab.id, {command: "find_cheapest"}, function(resp) { console.log("response to test signal to gflights:"+resp) }); 
	}
});

});
