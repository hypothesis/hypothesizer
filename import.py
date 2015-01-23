#!/usr/bin/env python

import os
from getpass import getpass
import json

import requests

couch = 'https://hypothesis.cloudant.com/hypothesizer'
#couch = 'http://localhost:5984/hypothesizer'
user = 'hypothesis'
password = os.environ.get('COUCHDB_PASS')
if  password == None:
    password = getpass('Password for CouchDB:')

first_req = requests.get('https://hypothes.is/api/search?limit=1')
total = first_req.json()['total']
limit = 200 # h default afaik
offset = 0
errors = 0

while errors == 0:
    r = requests.get('https://hypothes.is/api/search',
            params = {'limit': limit, 'offset': offset})
    rows = r.json()['rows']
    for row in rows:
        row['_id'] = 'hypothes.is/a/' + row['id']

    r = requests.post(couch + '/_bulk_docs',
            auth=(user, password),
            headers=({'content-type': 'application/json'}),
            data=json.dumps({'docs': rows}))
    statuses = r.json()

    for status in statuses:
        if 'error' in status:
            errors += 1
    if errors == 0:
        print '{0} documents added.'.format(len(statuses) - errors)
    else:
        print '{0} documents conflicted.'.format(errors)
        print '{0} documents added.'.format(len(statuses) - errors)
        break
    # keep moving
    offset = offset + limit
