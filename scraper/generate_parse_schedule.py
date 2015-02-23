#!/usr/bin/python
from slugify import slugify

def generate_parse_schedule(first_index, last_index):
  def parse_schedule(soup, table_class):
    train_times = {}
    station_times = {}

    table = soup.find('table', attrs={'class': table_class})
    # Get Lines
    table_head = table.find('thead').find_all('th')
    train_lines = [col.text.strip() for col in [row for row in table_head]][first_index:][:-last_index] # the first 2 and last 2 columns are headers
    # train_lines.pop(21) # 21 is a column in this table that copies the header
    print(train_lines)

    table_rows = table.find('tbody').find_all('tr')
    # Get Stations
    for i, row in enumerate(table_rows):
      cells = [cell.text.strip() for cell in row.find_all(['th', 'td'])]
      print(i, cells)
      # Get Times
      times = cells[first_index:][:-last_index] # the first 2 and last 2 columns are headers
      # times.pop(21) # 21 is a column in this table that copies the header
      # Get Trains
      trains = {train_lines[i]: times[i] for i, time in enumerate(times) if time.encode('ascii', 'ignore')}
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
            'stations': {}
          }
        train_times[train_number]['times'].append(time)
        train_times[train_number]['stations'][station['slug']] = time
    return train_times, station_times
  return parse_schedule