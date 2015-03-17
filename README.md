
# CalTrain API

[![Build Status](https://travis-ci.org/thejsj/caltrain-api.svg)](https://travis-ci.org/thejsj/caltrain-api) [![Dependency Status](https://david-dm.org/thejsj/caltrain-api.svg)](https://david-dm.org/thejsj/caltrain-api) [![devDependency Status](https://david-dm.org/thejsj/caltrain-api/dev-status.svg)](https://david-dm.org/thejsj/caltrain-api#info=devDependencies)

Extremely simple API to get Caltrain schedule data.

### API Endpoints

There are two endpoints in this API: `/train` and `/station`,

#### /train/(`ID or train number`)

Provide a train `id` to see the schedule for that train.

```
curl http://caltrain-api.thejsj.com/v1/train/a7ae75c9-9905-56fd-8c70-279fd25d0373
```

[See Response](/v1/train/a7ae75c9-9905-56fd-8c70-279fd25d0373)

Provide a train number to see the schedule for that train.

```
curl http://caltrain-api.thejsj.com/v1/train/103
```

[See Response](/v1/train/103)

#### /train

Provide a `from` station and a `to` station and get a list of departures.

```
curl http://caltrain-api.thejsj.com/v1/train \
    -d from='22nd-street' \ // station slug
    -d to='mountain-view'   // station slug
```

[See Response](/v1/train?from=22nd-street&to=mountain-view)

`Station`s (`from` and `to`) can be queried in two ways:

- station slug <String>
- station ID <Integer>

[See All Available Stations](/v1/station?fields=id,slug,name)

Provide a departure time and get the the closest departures. If `departure` is specified without `from`, the API will respond with a 400 error.

```
curl http://caltrain-api.thejsj.com/v1/train \
  -d from='22nd-street' \  // station slug
  -d to='mountain-view' \  // station slug
  -d departure=1424570262000 // Time
```

[See Response](/v1/train?from=22nd-street&to=mountain-view&departure=1424570262000)

`Time`s (`departure` and `arrival`) are parsed using JavaScripte `new Date`. Because of this, many types of `Time` inputs can be used. UNIX timestamps require milliseconds to work correctly.

Provide an arrival time an get the the closest departures. If `arrival` is specified without `to`, the API will respond with a 400 error.

```
curl http://caltrain-api.thejsj.com/v1/train \
  -d from=22nd-street \
  -d to=mountain-view \ 
  -d arrival=1424570262000 // UNIX timestamp <Number>
```

[See Response](/v1/train?from=22nd-street&to=mountain-view&departure=1424570262000)

Provide an type in order to filter results by local, limited or express trains.

```
curl http://caltrain-api.thejsj.com/v1/train \
  -d from=22nd-street \
  -d to=mountain-view \ 
  -d type=limited,express // 'local', 'limited', 'express'
```

[See Response](/v1/train?from=22nd-street&to=mountain-view&type=limited,express)

#### /station/(`ID or slug`)

Provide an `id` to get a particular station. Returns a JSON object.

```
curl http://caltrain-api.thejsj.com/v1/station/dfc2e118-6c85-3f22-b47e-569d62bc5953
```

[See Reponse](/v1/station/dfc2e118-6c85-3f22-b47e-569d62bc5953)

Provide a `slug` to get a particular station. Returns a JSON object.

```
curl http://caltrain-api.thejsj.com/v1/station/mountain-view
```

[See Response](/v1/station/mountain-view)

[See All Available Stations](/v1/station?fields=id,slug,name)

#### /station

Provide a `name`  in `/` to query stations with that name. Returns an array.

```
curl http://caltrain-api.thejsj.com/v1/station \
  -d name='san'
```

[See Resposne](/v1/station?name=san)

Provide a `longitude` and `latitude` to get an array of stations ordered by distance to that geolocation. This can be combined with `name` for more accurate queries.

```
curl http://caltrain-api.thejsj.com/v1/station \
  -d latitude='37.3876416'
  -d longitude='-122.0656136'
```

[See Resposne](/v1/station?latitude=37.3876416&longitude=-122.0656136)

### Filters and Options
 
Provide a `fields` in order to filter the response to only certain fields:

```
curl http://caltrain-api.thejsj.com/v1/station \
  -d name='san'
  -d fields='id,name,coordinates,trains'
```

[See Resposne](/v1/station?name=san&fields='id,name,coordinates,trains')

### Time Formats

All time formats are returned as ISO 8601. Time can be returned in any format by passing a `timeFormat` flag through the query using the following parameters:

```
curl http://caltrain-api.thejsj.com/v1/schedule \
    -d from='22nd-street' \ // station
    -d to='mountain-view'   // station
    -d timeFormat='YYYY MM dd HH:mm:s'
```

### Requests

Requests parameters can be sent in three types: 
  1. Data tags 
  1. JSON Serialized Object
  1. GET Query Parameters

1. Data Tags

```
curl http://caltrain-api.thejsj.com/v1/schedule \
    -d from='22nd-street' \ // station
    -d to='mountain-view'   // station
```

2. JSON Serialized Object

```
curl http://caltrain-api.thejsj.com/v1/schedule \
    -d '{
        "from": "22nd Street",
        "to": "Mountain View"
    }' 
```

3. GET Query Parameters

```
curl http://caltrain-api.thejsj.com/v1/schedule?from=22nd-street&to=mountain-view
```

### Response Format

All responses are in JSON format.

All timestamps are returned in ISO 8601 format.

All requests include a `Parameters` header with the parameters sent through the request.

All requests include an `Etag` and `Last modified` header.

## Tech 

Built on top of [io.js](https://iojs.org/en/index.html) and [RethinkDB](http://www.rethinkdb.com).