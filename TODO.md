## TODO

[ ] Scraper
    [ ] Shuttle Bus
 
[ ] Delays
    [ ] Connect to Twitter API

[ ] Create API
    [ ] Add Pagination http://dev.billysbilling.com/blog/How-to-make-your-API-better-than-the-REST
    [ ] Add Rate Limiting http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#rate-limiting
    [ ] Adding Google Analytics to API Request
    [ ] Add better tests for trains/stations that don't exist

[ ] Deployment
    [ ] Add Varnish

[ ] Tests
    [ ] Add tests for trains past midnight
    [ ] Test weekend trains

## DONE

[x] Scraper
    [x] Add Saturday VS. Sunday Service
    [x] Add Express/Limited/Local
    [x] Write Tests
    [x] Train may leave up to 5 minutes early
    [x] Train departure may be delayed up to 15 minutes
    [x] Add am and pm
    [x] Convert into 2 JSON files (stations.json and train.json)
    [x] Add geolocation to stations (Google Maps API?)
    [x] Fix stations with 'leaving', 'arriving'
    [x] Add order of stations
    [X] Add `north` and `south` direction to times and stations
    [x] Make only 1 stations and trains dict with no repetitions
        [x] Station
            [x] Add times as dict with `weekday`, `saturday`, and `sunday` keys
            [x] Add trains as dict with `weekday`, `saturday`, and `sunday` keys
        [x] Train
            [x] Add stations as dict with `weekday`, `saturday`, and `sunday` keys
            [x] Add times as dict with `weekday`, `saturday`, and `sunday` keys
    [x] Fix `north` not showing up in weekends

[x] Import to RethinkDB
    [x] Create tables (if necessary)
    [x] Create indexes
    [x] Add documents

[x] Create API
    [x] Install io.js
    [x] Add express.js, bodyParser
    [x] Add Routes
    [x] Add custom arg parser
    [x] Add database queries for /station
    [x] Add database queries for /station/search
    [x] Remove `/search` query
    [x] Add database queries for /train
        [x] From and to
        [x] Departure and arrival
        [x] Train type filter
        [x] Geolocation
    [x] Add fields query (Only get certain fields)
        [x] _.pluck with fields
    [x] Fix times for certain responses (trains 139, 142)
    [x] Append times for today or departure arrival day (Add option)
        [x] Parse times into ISO 8601
        [x] Add option for time format parsing
    [x] ETag http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#caching
    [x] Last Modified http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#caching
    [x] Add way to query all stations.
        [x] Don't throw an error when no `name` or `from`/`to` are passed
    [x] Add way to query all trains
    [x] Time Format - Specify time format in which to render times
    [x] Remove querying by ID (ID might change when importing data)

[x] Improving README
    [x] Add example response
    [x] Add example queries in url format
    [x] Make it clear that you can search for stations

[x] Deployment
    [x] Add fig files
    [x] Add GZip

[x] Tests
    [x] Add tests for timestamps
    [x] Add tests for all trains having `times` and `stations`
    [x] Add tests for all stations having `times` and `trains`
