import rethinkdb as r
from rethinkdb import RqlRuntimeError
import json, os

class CaltrainFileImport():

  def __init__(self, db='caltrain'):
    # Import Into Database
    self.conn = r.connect(host="localhost", port=28015, db=db, auth_key="", timeout=20)
    self.conn.use(db)

  def delete_tables(self):
    table_list = r.table_list().run(self.conn)
    if 'trains' in table_list:
      r.table_drop('trains').run(self.conn)
    if 'stations' in table_list:
      r.table_drop('stations').run(self.conn)

  def create_tables(self):
    table_list = r.table_list().run(self.conn)
    if 'trains' not in table_list:
      r.table_create('trains').run(self.conn)
      r.table('trains').index_create('number').run(self.conn)
    if 'stations' not in table_list:
      r.table_create('stations').run(self.conn)
      r.table('trains').index_create('name').run(self.conn)
    if 'meta' not in table_list:
      r.table_create('meta').run(self.conn)

  def get_file_entries(self, file_name, table_name):
    # Open File
    parent_path = os.path.abspath(os.curdir)
    import_file_location = os.path.join(parent_path, 'data/json', file_name)
    import_file = open(import_file_location)
    import_file_str = json.loads(import_file.read())
    import_file.close()
    return import_file_str

  def update_meta(self):
    r.table('meta').insert({
          'last_modified': r.now()
        }).run(self.conn)

  def import_file(self, file_name, table_name):
    entries = self.get_file_entries(file_name, table_name)
    for entry in entries:
      r.table(table_name).insert(entry).run(self.conn)
