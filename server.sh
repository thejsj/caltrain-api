cd /app
pip install -q -r requirements.pip
python scraper -i -g -c

cd /app/
npm install -g babel nodemon
npm install

cd /app
ls node_modules
ls -R node_modules/babel/node_modules/babel-core/node_modules/core-js/

cd /app
npm run docs
nodemon --exec npm run babel-node -- server/server.js
