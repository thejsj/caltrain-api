#!/usr/bin/python
import urllib2
from bs4 import BeautifulSoup
import json
from slugify import slugify
import os

def parse_weekday_schedule(soup, table_class):

  train_times = {}
  station_times = {}

  table = soup.find('table', attrs={'class': table_class})
  # Get Lines
  table_head = table.find('thead').find_all('th')
  train_lines = [col.text.strip() for col in [row for row in table_head]][2:][:-2] # the first 2 and last 2 columns are headers
  train_lines.pop(21) # 21 is a column in this table that copies the header

  table_rows = table.find('tbody').find_all('tr')
  # Get Stations
  for i, row in enumerate(table_rows):
    cells = [cell.text.strip() for cell in row.find_all(['th', 'td'])]
    # Get Times
    times = cells[2:][:-2] # the first 2 and last 2 columns are headers
    times.pop(21) # 21 is a column in this table that copies the header
    # Get Trains
    trains = {train_lines[i]: times[i] for i, time in enumerate(times) if time and time is not '\u2014'}
    # Remove empty times
    times = [time for time in times if time and time is not '\u2014']
    station_times[slugify(cells[1])] = {
      'name': cells[1],
      'slug': slugify(cells[1]),
      'zone': cells[0],
      'times': times,
      'trains': trains
    }
  for station_slug, station in station_times.iteritems():
    for train_number, time in station['trains'].iteritems():
      if train_number not in train_times:
        train_times[train_number] = {
          'number': train_number,
          'times': [],
          'stations': {}
        }
      train_times[train_number]['times'].append(time)
      train_times[train_number]['stations'][station['slug']] = time
  return train_times, station_times

def parse_weekend_schedule(soup, table_class):

  train_times = {}
  station_times = {}

  table = soup.find('table', attrs={'class': table_class})
  # Get Lines
  table_head = table.find('thead').find_all('th')
  train_lines = [col.text.strip() for col in [row for row in table_head]][3:][:-2] # the first 2 and last 2 columns are headers
  # train_lines.pop(21) # 21 is a column in this table that copies the header
  print(train_lines)

  table_rows = table.find('tbody').find_all('tr')
  # Get Stations
  for i, row in enumerate(table_rows):
    cells = [cell.text.strip() for cell in row.find_all(['th', 'td'])]
    print(i, cells)
    # Get Times
    times = cells[3:][:-2] # the first 2 and last 2 columns are headers
    # times.pop(21) # 21 is a column in this table that copies the header
    # Get Trains
    trains = {train_lines[i]: times[i] for i, time in enumerate(times) if time and time is not '—'}
    # Remove empty times
    times = [time for time in times if time and time is not '—']
    station_times[slugify(cells[1])] = {
      'name': cells[1],
      'slug': slugify(cells[1]),
      'zone': cells[0],
      'times': times,
      'trains': trains
    }
  for station_slug, station in station_times.iteritems():
    for train_number, time in station['trains'].iteritems():
      if train_number not in train_times:
        train_times[train_number] = {
          'number': train_number,
          'times': [],
          'stations': {}
        }
      train_times[train_number]['times'].append(time)
      train_times[train_number]['stations'][station['slug']] = time
  return train_times, station_times

def save_to_json(data, name):
  parent_path = os.path.abspath(os.curdir)
  file_name = "%s/%s.json" % ('data', name)
  file_location = os.path.join(parent_path, file_name)
  print"Saving To: %s" % file_location
  json_file = open(file_location, 'w')
  json_file.write(json.dumps(data))
  json_file.close()

def get_schedule(schedule_url, schedule_name):
  print('Get URL', schedule_url)
  html = urllib2.urlopen(schedule_url).read()
  soup = BeautifulSoup(html)
  directions = {
    'north': 'NB_TT',
    'south': 'SB_TT'
  }
  for key, value in directions.iteritems():
    if schedule_name is 'weekday':
      train_times, station_times = parse_weekday_schedule(soup, value)
    elif schedule_name is 'weekend':
      train_times, station_times = parse_weekend_schedule(soup, value)
    save_to_json(train_times, 'train-times-%s-%s' % (schedule_name, key) )
    save_to_json(station_times, 'station-times-%s-%s' % (schedule_name, key))

def main():
  urls = {
    'weekday': 'http://www.caltrain.com/schedules/weekdaytimetable.html',
    'weekend': 'http://www.caltrain.com/schedules/weekend-timetable.html'
  }
  for key, url in urls.iteritems():
    get_schedule(url, key)

if __name__ == "__main__":
  main()