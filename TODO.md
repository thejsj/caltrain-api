
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
    [ ] Add geolocation to stations (Google Maps API?)
    [ ] Fix stations with 'leaving', 'arriving'
    [x] Add order of stations
    [X] Add `north` and `south` direction to times and stations
    [x] Make only 1 stations and trains dict with no repetitions
        [x] Station
            [x] Add times as dict with `weekday`, `saturday`, and `sunday` keys
            [x] Add trains as dict with `weekday`, `saturday`, and `sunday` keys
        [x] Train
            [x] Add stations as dict with `weekday`, `saturday`, and `sunday` keys
            [x] Add times as dict with `weekday`, `saturday`, and `sunday` keys

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
    [ ] Remove `/search` query
    [ ] Add database queries for /train
        [x] From and to
        [x] Departure and arrival
        [x] Train type filter
        [ ] Geolocation
    [ ] Add fields query (Only get certain fields)
        [ ] _.pluck with fields
    [ ] Only get times for Today (mapping result)(Add option)
    [ ] Add Pagination http://dev.billysbilling.com/blog/How-to-make-your-API-better-than-the-REST
    [ ] Add Rate Limiting http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#rate-limiting
    [x] ETag http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#caching
    [x] Last Modified http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#caching
    [ ] Adding Google Analytics to API Request

[ ] Tests
    [ ] Add tests for timestamps
    [ ] Add tests for trains past midnight

[ ] Deployment
    [ ] Add fig files
