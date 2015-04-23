cd /app
pip install -q -r requirements.pip
python scraper -i -g -c

cd /app/
npm install

cd /app
npm run docs
npm start
