#!/usr/bin/python
from bs4 import BeautifulSoup
import os, urllib2, json
import sys, argparse
from generate_parse_schedule import generate_parse_schedule

parse_weekday_schedule = generate_parse_schedule(2, 2)
parse_weekend_schedule = generate_parse_schedule(3, 2)
train_times = False
station_times = False

def get_location(name, file_extension):
  parent_path = os.path.abspath(os.curdir)
  file_name = "%s/%s/%s.%s" % ('data', file_extension, name, file_extension)
  return os.path.join(parent_path, file_name)

def get_schedule(schedule_url, schedule_name):
  global train_times, station_times
  html = open(get_location(schedule_name, 'html'), 'r')
  soup = BeautifulSoup(html)
  directions = {
    'north': 'NB_TT',
    'south': 'SB_TT'
  }
  train_times = True
  station_times = True
  for key, value in directions.iteritems():
    if schedule_name is 'weekday':
      train_times, station_times = parse_weekday_schedule(soup, value)
    elif schedule_name is 'weekend':
      train_times, station_times = parse_weekend_schedule(soup, value)
    save_to_json(train_times, 'train-times-%s-%s' % (schedule_name, key) )
    save_to_json(station_times, 'station-times-%s-%s' % (schedule_name, key))

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
  #  'weekday': 'http://www.caltrain.com/schedules/weekdaytimetable.html',
    'weekend': 'http://www.caltrain.com/schedules/weekend-timetable.html'
  }
  if args.clear: clear_cache(urls)
  for key, url in urls.iteritems():
    get_schedule(url, key)

if __name__ == "__main__":
  main()