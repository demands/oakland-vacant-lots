#!/usr/bin/env bash

if ! $(which -s node); then
  echo "You need node.js on your system! Install it here: http://nodejs.org/" 1>&2
  exit 1
fi

if ! $(which -s mongo); then
  echo "You need mongodb on your system! If you're on a mac, try \`brew install mongodb\`." 1>&2
  exit 1
fi

npm install
curl https://raw.githubusercontent.com/map-communities/oakland-vacant-lots/master/oakland-vacant-lots.geojson | ./node_modules/.bin/map-communities-import-mongodb oakland-map
npm run build
