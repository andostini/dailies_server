python3 -m venv venv

. venv/bin/activate

pip install -r requirements.txt

export FLASK_APP=flaskr
export FLASK_ENV=development
export FLASK_DEBUG=True
export MAIL_USERNAME=deckerfabian@ymail.com
export MAIL_PASSWORD=haha

flask init-db

flask run
