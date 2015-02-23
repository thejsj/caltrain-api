#!/usr/bin/python
from slugify import slugify

def get_type(train_number, day_type):
  try:
    train_number = int(train_number)
  except ValueError:
    return False
  if day_type is 'weekday':
    if train_number >= 300 and train_number < 400: return 'express'
    if train_number >= 200 and train_number < 300: return 'limited'
    if train_number >= 100 and train_number < 200: return 'local'
    return False
  if day_type is 'saturday' or day_type is 'sunday':
    if train_number >= 800 and train_number < 900: return 'express'
    if train_number >= 400 and train_number < 500: return 'local'
    return False

def filter_saturday_only_trains(trains):
  sat_only = [421, 451, 450, 454]
  trains = {train_number: time for train_number, time in trains.iteritems() if train_number not in sat_only}
  print trains.keys()
  return trains

def generate_parse_schedule(first_index, last_index, day_type):
  def parse_schedule(soup, table_class):
    train_times = {}
    station_times = {}

    table = soup.find('table', attrs={'class': table_class})
    # Get Lines
    table_head = table.find('thead').find_all('th')
    train_lines = [col.text.strip() for col in [row for row in table_head]][first_index:][:-last_index] # the first 2 and last 2 columns are headers
    # train_lines.pop(21) # 21 is a column in this table that copies the header

    table_rows = table.find('tbody').find_all('tr')
    # Get Stations
    for i, row in enumerate(table_rows):
      cells = [cell.text.strip() for cell in row.find_all(['th', 'td'])]
      # Get Times
      times = cells[first_index:][:-last_index] # the first 2 and last 2 columns are headers
      # times.pop(21) # 21 is a column in this table that copies the header
      # Get Trains
      trains = {train_lines[i]: times[i] for i, time in enumerate(times) if time.encode('ascii', 'ignore')}
      if day_type is 'sunday':
        trains = filter_saturday_only_trains(trains)
        print(trains)
      # Remove empty times
      times = [time for time in times if time.encode('ascii', 'ignore')]
      station_times[slugify(cells[first_index - 1])] = {
        'name': cells[first_index - 1],
        'slug': slugify(cells[first_index - 1]),
        'zone': cells[first_index - 2],
        'times': times,
        'trains': trains
      }
    for station_slug, station in station_times.iteritems():
      for train_number, time in station['trains'].iteritems():
        if train_number not in train_times:
          train_times[train_number] = {
            'number': train_number,
            'times': [],
            'type': get_type(train_number, day_type),
            'stations': {}
          }
        train_times[train_number]['times'].append(time)
        train_times[train_number]['stations'][station['slug']] = time
    return train_times, station_times
  return parse_schedule