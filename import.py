from getpass import getpass
import json

import requests

user = 'admin'
password = getpass('Password for CouchDB:')

first_req = requests.get('https://hypothes.is/api/search?limit=1')
total = first_req.json()['total']
limit = 200 # h default afaik

offset = total - limit # start at the back
while offset > 0:
    r = requests.get('https://hypothes.is/api/search',
            params = {'limit': limit, 'offset': offset})
    rows = r.json()['rows']
    for row in rows:
        row['_id'] = 'hypothes.is/a/' + row['id']

    r = requests.post('http://localhost:5984/hypothesizer/_bulk_docs',
            auth=(user, password),
            headers=({'content-type': 'application/json'}),
            data=json.dumps({'docs': rows}))

    # keep moving
    offset = offset - limit
