cd <PATH TO dailies_server>
. venv/bin/activate

export FLASK_APP=flaskr
export FLASK_ENV=development
export FLASK_DEBUG=True
export MAIL_USERNAME=deckerfabian@ymail.com
export MAIL_PASSWORD=haha

flask run
