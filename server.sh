cd /app
pip install -q -r requirements.pip
python scraper -i -g -c

cd /app/
npm install
npm run docs
npm start