#!/usr/bin/python
from bs4 import BeautifulSoup
import os, urllib2, json
import sys, argparse
from generate_parse_schedule import generate_parse_schedule

parse_weekday_schedule = generate_parse_schedule(2, 2, 'weekday')
parse_saturday_schedule = generate_parse_schedule(3, 2, 'saturday')
parse_sunday_schedule = generate_parse_schedule(3, 2, 'sunday')

def get_location(name, file_extension):
  parent_path = os.path.abspath(os.curdir)
  file_name = "%s/%s/%s.%s" % ('data', file_extension, name, file_extension)
  return os.path.join(parent_path, file_name)

def get_schedule(schedule_url, schedule_name, train_times, station_times):
  html = open(get_location(schedule_name, 'html'), 'r')
  soup = BeautifulSoup(html)
  directions = {
    'north': 'NB_TT',
    'south': 'SB_TT'
  }
  for key, value in directions.iteritems():
    if schedule_name is 'weekday':
      _train_times, _station_times = parse_weekday_schedule(soup, value)
    elif schedule_name is 'saturday':
      _train_times, _station_times = parse_saturday_schedule(soup, value)
    elif schedule_name is 'sunday':
      _train_times, _station_times = parse_sunday_schedule(soup, value)
    train_times =  train_times + _train_times.values()
    station_times = station_times + _station_times.values()
  return train_times, station_times

def clear_cache(urls):
  print('Clear Cache')
  for name, url in urls.iteritems():
    print('Get URL', url)
    html = urllib2.urlopen(url).read()
    html_file = open(get_location(name, 'html'), 'w')
    html_file.write(html)
    html_file.close()

def save_to_json(data, name):
  print("Saving To: %s" % get_location(name, 'json'))
  json_file = open(get_location(name, 'json'), 'w')
  json_file.write(json.dumps(data))
  json_file.close()

parser = argparse.ArgumentParser(description = "Scrapes the Caltrain website")
parser.add_argument('-c', '--clear', action='store_true', help="Clear the current cache of HTML files")

def main():
  args = parser.parse_args(sys.argv[1:])
  urls = {
    'weekday': 'http://www.caltrain.com/schedules/weekdaytimetable.html',
    'saturday': 'http://www.caltrain.com/schedules/weekend-timetable.html',
    'sunday': 'http://www.caltrain.com/schedules/weekend-timetable.html'
  }
  if args.clear: clear_cache(urls)
  train_times = []
  station_times = []
  for key, url in urls.iteritems():
    train_times, station_times = get_schedule(url, key, train_times, station_times)
  save_to_json(train_times, 'trains' )
  save_to_json(station_times, 'station')

if __name__ == "__main__":
  main()