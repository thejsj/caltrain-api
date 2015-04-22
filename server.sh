cd /app
pip install -q -r requirements.pip
python scraper -i -g -c

cd /app/
ls -Rla node_modules/babel/node_modules/babel-core/node_modules/core-js/
npm install
npm run docs
npm start
