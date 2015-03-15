echo 'python.sh'
cd /app
pip install -r requirements.pip
python scraper -i -g -c
echo 'server.sh'
cd /app/
npm install -g babel
npm install
npm start