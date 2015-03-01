
# CalTrain API

**This is still in development. None of it actually works yet :)**

Extremely simple API to get Caltrain schedule data.

## API

### Endpoints

There are two endpoints in this API: `/train` and `/station`,

#### /train

Provide a `from` station and a `to` station and get a list of departures.

```
curl http://api.caltrain-api.com/v1/train \
    -d from='22nd-street' \ // Station
    -d to='mountain-view'   // Station
```

`Station`s (`from` and `to`) can be queried in two ways:

- Station Name <String>
- Station ID <Integer>

Provide a departure time an get the the closest departures.

```
curl http://api.caltrain-api.com/v1/train \
  -d from='22nd-street' \ // Station
  -d to='mountain-view' \  // Station
  -d departure='1424570262' // Time
```

`Time` (`departure` and `arrival`) can be queried in two ways:

- Unix Timestamp `<Number>`
- Time and Format `<Array>` (A tuple with a time `<String>` and the format `<String>`)(in serialized JSON)
- Time `<String>` (To be automatically parse by `moment.js`)

Provide an arrival time an get the the closest departures.

```
curl http://api.caltrain-api.com/v1/train \
  -d station_from='22nd-street' \
  -d station_to='mountain-view' \ 
  -d arrival='1424570262' // Unix Timestamp <Number>
```

Provide an type in order to filter results by local, limited or express trains.

```
curl http://api.caltrain-api.com/v1/train \
  -d station_from='22nd-street' \
  -d station_to='mountain-view' \ 
  -d train_type='limited,express'
```

Provide a train `id` to see the schedule for that train.

```
curl http://api.caltrain-api.com/v1/train \
  -d id='d9000734-078e-490b-bbfa-c11fb2f48322'
```

Provide a train number to see the schedule for that train.

```
curl http://api.caltrain-api.com/v1/train \
  -d number='103'
```

#### /station

Provide an `id` to get a particular station. Returns a JSON object.

```
curl http://api.caltrain-api.com/v1/station \
  -d id='d9000734-078e-490b-bbfa-c11fb2f48322'
```

Provide a `slug` to get a particular station. Returns a JSON object.

```
curl http://api.caltrain-api.com/v1/station \
  -d slug='mountain-view'
```

Provide a `name`  in `/search` to query stations with that name. Returns an array.

```
curl http://api.caltrain-api.com/v1/station \
  -d slug='mountain-view'
```


Provide a `longitude` and `latitude` to get the closest station to that location. Returns an array.

```
curl http://api.caltrain-api.com/v1/station \
  -d latitude='37.3876416'
  -d longitude='-122.0656136'
```

### Requests

Requests data can be based by form-encoded data and by JSON-serialized strings:

```
curl http://api.caltrain-api.com/v1/schedule \
    -d from='22nd Street' \ // Station
    -d to='Mountain View'   // Station
```

is the same as: 

```
curl http://api.caltrain-api.com/v1/schedule \
    -d '{
        "from": "22nd Street",
        "to": "Mountain View"
    }' 
```

### Response Format

All responses are in JSON format.

All responses include the following as part of the response:

- `id`: UUID of request
- `created_at`: Time response was created

All timestamps are returned in ISO 8601 format.

All responses include the following headers:

- X-RateLimit-Limit: 5000
- X-RateLimit-Remaining: 4966
- X-RateLimit-Reset: 1372700873

## Tech 

Built on top of Node.js and RethinDB.