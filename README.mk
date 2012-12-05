HODOR: A flight information scraper for Carnival cruises
========================================================


What is this? 
-------------

Trying to order a cruise is a pain mostly because the price consists of two
main components: the cruise fare and the flight. Trying to search for both of
these in an organized fashion usually requires 3 windows: the cruise page, the 
flights page, and a spreadsheet. Furthermore, having to manually pick out flights
that land in the morning (so you have time to get to the port) and leave in the
afternoon (so you have time to get to the airport) is a pain. 

Enter HODOR (see http://gameofthrones.wikia.com/wiki/Hodor if you don't understand the reference). 
Hodor is not particularly clever, but he will make your life easier by fetching flight information
for a particular cruise and putting it right into the page. The hope is that now you only need 
two windows -- the cruise page and your spreadsheet and no more typing in silly dates and airport codes. 

How do I use hodor?
-----
First, you'll want to grab the source code and adjust the variables in
bg.js (for the moment they are kind of spread out, but the main ones are 
in the generate_google_flights_url() function like your airport and time 
filters. 

Then, open a new tab and navigate to chrome://extensions. Enable the developer mode
and click "load unpacked extension". Navigate to the source folder and open it. 
Now, you should have Hodor in your tool bar. If you click the arrow next to hodor in 
the extensions list and click "_generated_background_page.html" -- a developer tools 
window should come up. Click on the console tab and make sure that there's a log message that 
reads: "hodor bg page loaded". If so, you're ready to use Hodor to do your bidding. 

Open a carnival page and do a search for cruises. When you're on the search results 
page, click the hodor button and a bunch of links should come up under each result. 

Clicking a link will trigger a google flights page to open. 2 seconds later, the flight 
information will be returned to the page. Please heed the warning below.

WARNING
============
This is not production code -- it's just a small tool I wrote to help myself optimize a painful 
search process and I wanted to share it with others. **PLEASE DOUBLE CHECK ALL DATES, TIMES, AIRPORTS, ETC. 
BEFORE ORDERING ANY FLIGHTS**. If you order the wrong flight for your cruise, I don't take any responsibility.

License
------
I'm releasing the code under GPLv3. See the LICENSE and COPYING files for the GPLv3 notices.
