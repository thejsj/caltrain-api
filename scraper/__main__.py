#!/usr/bin/python
from bs4 import BeautifulSoup
import os, urllib2, json
import sys, argparse
from generate_parse_schedule import ScheduleParser
from db.file_import import CaltrainFileImport

class CaltrainScraper():

  def __init__(self):
    parser = argparse.ArgumentParser(description = "Scrapes the Caltrain website")
    parser.add_argument('-c', '--clear', action='store_true', help="Clear the current cache of HTML files")
    parser.add_argument('-i', '--file_import', action='store_true', help="Import JSON files into database")
    parser.add_argument('-db', '--database', type=str, default='caltrain', help="Name of database to import results to")
    parser.add_argument('-g', '--append_geolocation', action='store_true', help="Geolocate stations using Google Maps API")
    args = parser.parse_args(sys.argv[1:])

    schedule_parser = ScheduleParser()
    self.parse_weekday_schedule = schedule_parser.generate_parse_schedule(2, 2, 'weekday')
    self.parse_saturday_schedule = schedule_parser.generate_parse_schedule(3, 0, 'saturday')
    self.parse_sunday_schedule = schedule_parser.generate_parse_schedule(3, 0, 'sunday')

    urls = {
      'saturday': 'http://www.caltrain.com/schedules/weekend-timetable.html',
      'weekday': 'http://www.caltrain.com/schedules/weekdaytimetable.html',
      'sunday': 'http://www.caltrain.com/schedules/weekend-timetable.html',
    }

    if args.clear: self.clear_cache(urls)

    train_times = {}
    station_times = {}
    for key, url in urls.iteritems():
      train_times, station_times = self.get_schedule(
        url,
        key,
        train_times=train_times,
        station_times=station_times,
        append_geolocation=args.append_geolocation
      )

    self.save_to_json(train_times.values(), 'trains')
    self.save_to_json(station_times.values(), 'stations')

    if args.file_import is True:
      caltrain_import = CaltrainFileImport(db=args.database)
      caltrain_import.delete_tables()
      caltrain_import.create_tables()
      caltrain_import.import_file('trains.json', 'trains')
      caltrain_import.import_file('stations.json', 'stations')
      caltrain_import.update_meta()

  def get_location(self, name, file_extension):
    parent_path = os.path.abspath(os.curdir)
    file_name = "%s/%s/%s.%s" % ('data', file_extension, name, file_extension)
    return os.path.join(parent_path, file_name)

  def get_schedule(self, schedule_url, schedule_name, **kwargs):
    train_times = kwargs['train_times']
    station_times = kwargs['station_times']
    append_geolocation = kwargs['append_geolocation']

    html = open(self.get_location(schedule_name, 'html'), 'r')
    soup = BeautifulSoup(html)
    directions = {
      'north': 'NB_TT',
      'south': 'SB_TT'
    }
    for key, value in directions.iteritems():
      if schedule_name is 'weekday':
        train_times, station_times = self.parse_weekday_schedule(
          soup,
          value,
          train_times=train_times,
          station_times=station_times,
          append_geolocation=append_geolocation
        )
      elif schedule_name is 'saturday':
        train_times, station_times = self.parse_saturday_schedule(
          soup,
          value,
          train_times=train_times,
          station_times=station_times,
          append_geolocation=append_geolocation
        )
      elif schedule_name is 'sunday':
        train_times, station_times = self.parse_sunday_schedule(
          soup,
          value,
          train_times=train_times,
          station_times=station_times,
          append_geolocation=append_geolocation
        )
    return train_times, station_times

  def clear_cache(self, urls):
    print('Clear Cache')
    for name, url in urls.iteritems():
      print('Get URL', url)
      html = urllib2.urlopen(url).read()
      html_file = open(self.get_location(name, 'html'), 'w')
      html_file.write(html)
      html_file.close()

  def save_to_json(self, data, name):
    print("Saving To: %s" % self.get_location(name, 'json'))
    json_file = open(self.get_location(name, 'json'), 'w')
    json_file.write(json.dumps(data, sort_keys=True, indent=2, separators=(',', ': ')))
    json_file.close()

if __name__ == "__main__":
  CaltrainScraper()