cd /app
pip install -q -r requirements.pip
python scraper -i -g -c

cd /app/
npm install

cd /app/node_modules/babel/node_modules/babel-core/node_modules/core-js/
npm install
cd /app
ls node_modules
ls -R node_modules/babel/node_modules/babel-core/node_modules/core-js/

cd /app
npm run docs
npm start
