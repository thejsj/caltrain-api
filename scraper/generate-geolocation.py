from pygeocoder import Geocoder
from time import sleep

"""
File is currently not working. Would need a way to get stations...
"""
slug = "san-francisco"
station_name = "San Francisco"

sleep(0.2)
location = Geocoder.geocode(station_name + " Caltrain Station, CA")
coordinates = location[0].coordinates
print "    " + "\"" + slug + "\" : [" + str(coordinates[0]) + ", " + str(coordinates[1]) + "],"
