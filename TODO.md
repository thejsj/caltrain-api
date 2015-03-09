
## TODO

[x] Scraper
    [x] Add Saturday VS. Sunday Service
    [x] Add Express/Limited/Local
    [x] Write Tests
    [ ] Shuttle Bus
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

[ ] Create API
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
    [ ] Parse all times in to H:mm
        [ ] Add `time_format='minutes'` Returns time in minutes
        [ ] Add `time_format='H:mm'` Returns time in 'H:mm'
    [ ] Append times for today or departure arrival day (Add option)
        [ ] Add `today=true`
        [ ] Parse times into ISO 8601
        [ ] Add option for time format parsing 
    [ ] Add Pagination http://dev.billysbilling.com/blog/How-to-make-your-API-better-than-the-REST
    [ ] Add Rate Limiting http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#rate-limiting
    [x] ETag http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#caching
    [x] Last Modified http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#caching
    [ ] Adding Google Analytics to API Request

[ ] Tests
    [x] Add tests for timestamps
    [ ] Add tests for trains past midnight

[ ] Deployment
    [ ] Add fig files

[ ] Improving README
    [ ] Add example response
    [ ] Add example queries in url format
    [ ] Make it clear that you can search for stations