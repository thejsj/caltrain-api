#!/usr/bin/python
import urllib2
from bs4 import BeautifulSoup
import json

def getScheduleURL(schedule_url):
  print('Get URL',
    schedule_url)
  html = urllib2.urlopen(schedule_url).read()
  soup = BeautifulSoup(html)

  data = []

  table = soup.find('table', attrs={'class':'NB_TT'})
  # Get Lines
  table_head = table.find('thead').find_all('th')
  train_lines = [col.text.strip() for col in [row for row in table_head]][2:][:-2]
  train_lines.remove('Northbound Train No.')
  print(train_lines)

  # Get Stations
  table_rows = table.find('tbody').find_all('tr')
  for i, row in enumerate(table_rows):
    print(i, row)
    for ii, col in enumerate(row):
      if hasattr(col, 'text'):
        print(i, ii, col.text.strip())

  # train_numbers = [header.text.strip() for header in table.find('thead').]
  # stations = [header.text.strip() for header in table.find('tbody').find_all('th')]
  # rows = []

  # for row in table.find_all('tr'):
  #   rows.append([val.text.strip() for val in row.find_all('td')])

  # print(train_numbers)
  # print(' - ')
  # print(stations)
  # print(' - ')
  # print(rows)

def main():
  urls = [
    'http://www.caltrain.com/schedules/weekdaytimetable.html'
  ]
  for url in urls:
    getScheduleURL(url)

if __name__ == "__main__":
  main()