echo 'python.sh'
cd /app
pip install -r requirements.pip
python scraper -i -g
echo 'server.sh'
cd /app/
npm start