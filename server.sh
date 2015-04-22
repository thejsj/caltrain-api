cd /app
pip install -q -r requirements.pip
python scraper -i -g -c

cd /app/
npm install -g babel nodemon
npm install

cd /app
npm run docs
npm run dev
