echo 'python'
cd /app
pip install -r requirements.pip
python scraper -i -g -c
echo 'server'
cd /app/
npm install -g babel
npm install
echo 'Installed!'
npm list
npm start