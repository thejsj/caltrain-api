import unittest
import os, json
import re, operator

def open_file(name):
  parent_path = os.path.abspath(os.curdir)
  file_name = "%s/%s/%s.%s" % ('data', 'json', name, 'json')
  file_path = os.path.join(parent_path, file_name)
  json_file = open(file_path, 'r')
  json_str = json_file.read()
  json_file.close()
  return json.loads(json_str)

def convert_to_dict(dict_list, property_name):
  keys = map(operator.itemgetter(property_name), dict_list)
  return dict(zip(keys, dict_list))

train_times = open_file('trains')
staiton_times = open_file('stations')
train_times_dict = convert_to_dict(train_times, 'number')
station_times_dict = convert_to_dict(staiton_times, 'name')

class BasicTests(unittest.TestCase):

  def setUp(self):
    pass

  def test_types(self):
    # make sure the shuffled sequence does not lose any elements
    self.assertEqual(type(train_times), list)
    self.assertEqual(type(staiton_times), list)
    self.assertEqual(type(train_times[0]), dict)
    self.assertEqual(type(staiton_times[0]), dict)

class StationTests(unittest.TestCase):

  def setUp(self):
    pass

  # Test that our lists match our dictionaries
  def test_station_time_length(self):
    for station in staiton_times:
      self.assertEqual(len(station['times']), len(station['trains'].keys()))

  # Test that all numbers are properly structured
  def test_station_times(self):
    is_time = re.compile(r'^[0-9]{1,2}:[0-9]{2}$')
    for station in staiton_times:
      for time in station['times']:
        self.assertTrue(bool(is_time.match(time)))
      for time in station['trains'].values():
        self.assertTrue(bool(is_time.match(time)))

  # Test all stations keys
  def test_stations_keys(self):
    is_train = re.compile(r'^[0-9]{3}$')
    for station in staiton_times:
      for train in station['trains'].keys():
        self.assertTrue(bool(is_train.match(train)))

class TrainTests(unittest.TestCase):

  def setUp(self):
    pass

  # All list lengths should match dictionary lengths
  def test_train_time_length(self):
    for station in train_times:
      self.assertEqual(len(station['times']), len(station['stations'].keys()))

  # All times should be properly structured
  def test_train_times(self):
    is_time = re.compile(r'^[0-9]{1,2}:[0-9]{2}$')
    for station in train_times:
      for time in station['times']:
        self.assertTrue(bool(is_time.match(time)))
      for time in station['stations'].values():
        self.assertTrue(bool(is_time.match(time)))

  # All train numbers should just be numbers
  def test_stations_keys(self):
    is_train = re.compile(r'^[0-9]{3}$')
    for train in train_times:
      self.assertTrue(bool(is_train.match(train['number'])))

  # Trains should have the correct `may_leave_5_minutes_early`
  def test_train_may_leave_5_minutes_early(self):
    self.assertFalse(train_times_dict['217']['may_leave_5_minutes_early'])
    self.assertFalse(train_times_dict['429']['may_leave_5_minutes_early'])
    self.assertTrue(train_times_dict['199']['may_leave_5_minutes_early'])
    self.assertTrue(train_times_dict['451']['may_leave_5_minutes_early'])

  # Trains should have the correct `may_be_delayed_15_minutes`
  def test_train_day(self):
    # Not getting sundays in these keys
    self.assertEqual(train_times_dict['801']['day'], 'saturday')
    self.assertEqual(train_times_dict['451']['day'], 'saturday')
    self.assertEqual(train_times_dict['421']['day'], 'saturday')
    self.assertEqual(train_times_dict['454']['day'], 'saturday')
    # Saturday And Sunday
    saturday_and_sunday_trains = filter(lambda t: int(t['number']) == 801, train_times)
    self.assertEqual(len(saturday_and_sunday_trains), 2)
    saturday_and_sunday_trains = filter(lambda t: int(t['number']) == 423, train_times)
    self.assertEqual(len(saturday_and_sunday_trains), 2)
    # Only Sunday
    sunday_trains = filter(lambda t: int(t['number']) == 451, train_times)
    self.assertEqual(len(sunday_trains), 1)
    sunday_trains = filter(lambda t: int(t['number']) == 454, train_times)
    self.assertEqual(len(sunday_trains), 1)

if __name__ == '__main__':
    unittest.main()