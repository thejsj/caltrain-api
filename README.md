
# CalTrain API

[![Build Status](https://travis-ci.org/thejsj/caltrain-api.svg)](https://travis-ci.org/code-friends/CodeFriends) [![Dependency Status](https://david-dm.org/thejsj/caltrain-api.svg)](https://david-dm.org/code-friends/CodeFriends) [![devDependency Status](https://david-dm.org/thejsj/caltrain-api/dev-status.svg)](https://david-dm.org/code-friends/CodeFriends#info=devDependencies)

Extremely simple API to get Caltrain schedule data.

## API

### Endpoints

There are two endpoints in this API: `/train` and `/station`,

#### /train

Provide a `from` station and a `to` station and get a list of departures.

```
curl http://api.caltrain-api.com/v1/train \
    -d from='22nd-street' \ // station slug
    -d to='mountain-view'   // station slug
```

`Station`s (`from` and `to`) can be queried in two ways:

- station slug <String>
- station ID <Integer>

Provide a departure time and get the the closest departures. If `departure` is specified without `from`, the API will respond with a 400 error.

```
curl http://api.caltrain-api.com/v1/train \
  -d from='22nd-street' \  // station slug
  -d to='mountain-view' \  // station slug
  -d departure='1424570262' // Time
```

`Time` (`departure` and `arrival`) can be queried in two ways:

- Unix Timestamp `<Number>`
- Time and Format `<Array>` (A tuple with a time `<String>` and the format `<String>`)(in serialized JSON)
- Time `<String>` (To be automatically parse by `moment.js`)

Provide an arrival time an get the the closest departures. If `arrival` is specified without `to`, the API will respond with a 400 error.

```
curl http://api.caltrain-api.com/v1/train \
  -d from='22nd-street' \
  -d to='mountain-view' \ 
  -d arrival='1424570262' // UNIX timestamp <Number>
```

Provide an type in order to filter results by local, limited or express trains.

```
curl http://api.caltrain-api.com/v1/train \
  -d from='22nd-street' \
  -d to='mountain-view' \ 
  -d type='limited,express' // 'local', 'limited', 'express'
```

Provide a train `id` to see the schedule for that train.

```
curl http://api.caltrain-api.com/v1/train/d9000734-078e-490b-bbfa-c11fb2f48322
```

Provide a train number to see the schedule for that train.

```
curl http://api.caltrain-api.com/v1/train/103
```

#### /station

Provide an `id` to get a particular station. Returns a JSON object.

```
curl http://api.caltrain-api.com/v1/station/d9000734-078e-490b-bbfa-c11fb2f48322
```

Provide a `slug` to get a particular station. Returns a JSON object.

```
curl http://api.caltrain-api.com/v1/station/mountain-view
```

Provide a `name`  in `/` to query stations with that name. Returns an array.

```
curl http://api.caltrain-api.com/v1/station \
  -d name='san'
```


Provide a `longitude` and `latitude` to get the closest station to that location. Returns an array. Both 

```
curl http://api.caltrain-api.com/v1/station \
  -d latitude='37.3876416'
  -d longitude='-122.0656136'
```

### Filters and Options
 
Provide a `fields` in order to filter the response to only certain fields:

```
curl http://api.caltrain-api.com/v1/station \
  -d name='san'
  -d fields='id,name,coordinates,trains'
```

By default, the API always returns a `today` attribute in `train.times`, `train.stations`, `station.trains`, and `station.times`. This 

### Time Formats

All time formats are returned as 'H:mm', where H is a 24 hour based hour. Time can also be returned in minutes (as in minutes from 0:00), by passing the `time_format` flag with the value `minutes`.

```
curl http://api.caltrain-api.com/v1/schedule \
    -d from='22nd-street' \ // station
    -d to='mountain-view'   // station
    -d timeFormat='minutes'
```

### Requests

Requests parameters can be sent in three types: 
  1. Data tags 
  1. JSON Serialized Object
  1. GET Query Parameters

1. Data Tags

```
curl http://api.caltrain-api.com/v1/schedule \
    -d from='22nd-street' \ // station
    -d to='mountain-view'   // station
```

2. JSON Serialized Object

```
curl http://api.caltrain-api.com/v1/schedule \
    -d '{
        "from": "22nd Street",
        "to": "Mountain View"
    }' 
```

3. GET Query Parameters

```
curl http://api.caltrain-api.com/v1/schedule?from=22nd-street&to=mountain-view
```

### Response Format

All responses are in JSON format.

All timestamps are returned in ISO 8601 format.

All requests include a `Parameters` header with the parameters sent through the request.

All requests include an `Etag` and `Last modified` header.

## Tech 

Built on top of io.js and RethinkDB.