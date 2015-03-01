#!/usr/bin/python
from slugify import slugify
import re

class ScheduleParser():

  def __init__(self):
    self.start_star = re.compile(r'^\*')
    self.end_plus_sign = re.compile(r'\+{1}$')
    self.non_digits = re.compile(r'\D*')
    self.digits = re.compile(r'\d+')

  def get_type(self, train_number, day_type):
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

  def filter_saturday_only_trains(self, trains):
    sat_only = ['421', '451', '450', '454']
    return {
      train_number: time for train_number, time in trains.iteritems() if self.non_digits.sub('', train_number) not in sat_only
    }

  def get24HourBasedTime(self, text, row_num, col_num):
    text = self.start_star.sub('', text)
    text = self.end_plus_sign.sub('', text)
    split_numbers = text.split(':')
    if split_numbers[0].isdigit():
      if ((col_num < 8) or (col_num > 42)) and split_numbers[0] is '12':
        split_numbers[0] = '0'
      if col_num > 8 or (col_num > 6 and split_numbers[0] is '12'):
        split_numbers[0] = str(int(split_numbers[0]) + 12)
      text = split_numbers[0] + ':' + split_numbers[1]
    return text

  def getTrainNumber(self, text):
    text = self.start_star.sub('', text)
    text = self.end_plus_sign.sub('', text)
    return text

  def isTime(self, time):
    return bool(self.digits.search(time)) and 'street' not in time.lower()

  def generate_parse_schedule(self, first_index, last_index, day_type):
    def parse_schedule(soup, table_class, train_times, station_times):

      table = soup.find('table', attrs={'class': table_class})
      # Get Lines
      table_head = table.find('thead').find_all('th')
      train_lines = [col.text.strip() for col in [row for row in table_head]]
      # the first 2 and last 2 columns are headers
      if first_index > 0: train_lines = train_lines[first_index:]
      if last_index > 0: train_lines = train_lines[:-last_index]
      # train_lines.pop(21) # 21 is a column in this table that copies the header

      table_rows = table.find('tbody').find_all('tr')
      # Get Stations
      for i, row in enumerate(table_rows):
        cells = [cell.text.strip() for cell in row.find_all(['th', 'td'])]
        # Get Times
        times = cells # the first 2 and last 2 columns are headers
        if first_index > 0: times = times[first_index:]
        if last_index > 0: times = times[:-last_index]
        times = [self.get24HourBasedTime(time, i, ii) for ii, time in enumerate(times)]
        # times.pop(21) # 21 is a column in this table that copies the header
        # Get Trains
        train_strings = {self.getTrainNumber(train): train for train in train_lines}
        trains = {self.getTrainNumber(train_lines[i]): times[i] for i, time in enumerate(times) if self.isTime(time)}
        if day_type is 'sunday':
          trains = self.filter_saturday_only_trains(trains)

        print 'CHECKING', '454' in trains.keys(), day_type

        # Remove empty times
        station_name = cells[first_index - 1].replace(u'\xa0', u' ')
        slug = slugify(station_name)
        if slug not in station_times.keys():
          station_times[slug] = {
            'name': station_name,
            'slug': slug,
            'zone': cells[first_index - 2],
            'times': { },
            'trains': { }
          }
        station_times[slug]['times'][day_type] = trains.values()
        station_times[slug]['trains'][day_type] = trains

      for station_slug, station in station_times.iteritems():
        if day_type in station['trains']:
          for train_number, time in station['trains'][day_type].iteritems():
            if train_number not in train_times.keys():
              train_times[train_number] = {
                'number': int(train_number),
                'direction': ('south' if int(train_number) % 2 == 0 else 'north'),
                'type': self.get_type(train_number, day_type),
                'times': {},
                'stations': {},
                # Check if first chart is '*'
                'may_leave_5_minutes_early': bool(self.start_star.match(train_strings[train_number])),
                # Check if last char is '#'
                'may_be_delayed_15_minutes': bool(self.end_plus_sign.match(train_strings[train_number])),
              }
            if day_type not in train_times[train_number]['times']:
              train_times[train_number]['times'][day_type] = []
            if day_type not in train_times[train_number]['stations']:
              train_times[train_number]['stations'][day_type] = {}
            train_times[train_number]['times'][day_type].append(time)
            train_times[train_number]['stations'][day_type][station['slug']] = time
      return train_times, station_times
    return parse_schedule