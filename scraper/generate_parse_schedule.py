#!/usr/bin/python
from slugify import slugify
import re

start_star = re.compile(r'^\*')
end_plus_sign = re.compile(r'\+{1}$')

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
  nd = re.compile(r'\D*')
  sat_only = ['421', '451', '450', '454']
  return {train_number: time for train_number, time in trains.iteritems() if nd.sub('', train_number) not in sat_only}

def get24HourBasedTime(text, row_num, col_num):
  text = start_star.sub('', text)
  text = end_plus_sign.sub('', text)
  split_numbers = text.split(':')
  if split_numbers[0].isdigit():
    if ((col_num < 8) or (col_num > 42)) and split_numbers[0] is '12':
      split_numbers[0] = '0'
    if col_num > 8 or (col_num > 6 and split_numbers[0] is '12'):
      split_numbers[0] = str(int(split_numbers[0]) * 2)
    return split_numbers[0] + ':' + split_numbers[1]
  return text

def generate_parse_schedule(first_index, last_index, day_type):
  def parse_schedule(soup, table_class):
    print ('parse_schedule', table_class, day_type)
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
      # Remove empty times
      times = [time for time in times if time.encode('ascii', 'ignore')]
      station_times[slugify(cells[first_index - 1])] = {
        'name': cells[first_index - 1],
        'slug': slugify(cells[first_index - 1]),
        'zone': cells[first_index - 2],
        'times': [get24HourBasedTime(time, i, ii) for ii, time in enumerate(times)],
        'day': day_type,
        'trains': trains
      }
    for station_slug, station in station_times.iteritems():
      for train_number_str, time in station['trains'].iteritems():
        train_number = start_star.sub('', train_number_str)
        train_number = end_plus_sign.sub('', train_number_str)
        if train_number.isdigit():
          if train_number not in train_times:
            train_times[train_number] = {
              'number': train_number,
              'day': day_type,
              'direction': ('south' if int(train_number) % 2 == 0 else 'north'),
              'type': get_type(train_number, day_type),
              'times': [],
              'stations': {},
              'may_leave_5_minutes_early': bool(start_star.match(train_number_str)), # Check if first chart is '*'
              'may_be_delayed_15_minutes': bool(end_plus_sign.match(train_number_str)), # Check if last char is '#'
            }
          train_times[train_number]['times'].append(time)
          train_times[train_number]['stations'][station['slug']] = time
    return train_times, station_times
  return parse_schedule