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

chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.command=="find_cheapest")
				{
					console.log("gflight: find cheapest request");
					request["command"] = "cheapest_result"; 
					// a more reliable method for scraping stuff: 
					//  the gwt-HTML class is used a few times on the page, but only in two places does it have any divs inside of it. Find all the instances with 
					//  divs inside and filter out the one with id=adcontainer
					var target_elems = $('body').find(".gwt-HTML").has('div').filter(function(i,elem) { return $(elem).attr("id") != "adcontainer" })
					if (target_elems.length == 1) {
						console.log("successfully found the main table"); 
						target_elem = target_elems[0];
					}
					// Now select the div with elt=il, which appears to be the main "row" with the details in it
					detail_rows = $(target_elem).find('div[elt=il]');
					// Finally, go through each row and pull out all of the text nodes and stash them away 
					results_arr = []
					detail_rows.each(function(i,elem) {
						var all_text_nodes = $(elem).find('*').contents().filter(function () { return this.nodeType === 3;}).map(function(index, element) { 
								return element.nodeValue; 
								});
						results_arr.push(jQuery.makeArray(all_text_nodes).join(" "));
					});
					request["prices"] = results_arr;
					console.log("prices are: "+request["prices"]); 
					sendResponse(request);
				}
		});
