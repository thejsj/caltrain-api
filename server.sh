echo 'python'
cd /app
pip install -q -r requirements.pip
python scraper -i -g -c
echo 'server'
cd /app/
rm -rf node_modules
npm cache clean
npm install
echo 'Installed!'
npm run docs
npm start