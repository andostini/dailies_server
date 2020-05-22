import os

from flask import Flask, session, redirect, url_for,render_template, request
from datetime import timedelta


from markupsafe import escape
from flaskr.db import get_db
from flask_mail import Message, Mail



def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),

        MAIL_SERVER="smtp.mail.yahoo.com",
        MAIL_PORT=465,
        MAIL_USE_SSL=True,
        MAIL_USERNAME=os.environ['MAIL_USERNAME'],
        MAIL_PASSWORD=os.environ['MAIL_PASSWORD']
    )
    mail = Mail(app)
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.before_request
    def make_session_permanent():
        session.permanent = True
        app.permanent_session_lifetime = timedelta(hours=24)

    @app.route('/')
    def index():
        error = []
        success = []
        openProjects = []
        if 'projects' in session.keys():
            if session['username'] == 'viewer':
                projectIds = session['projects'].split(';') #Receive project ID to projects, the viewer is logged in to
                db = get_db()

                for projectId in projectIds:
                    project = db.execute('SELECT * FROM projects WHERE id = ?', (escape(projectId),)).fetchone()
                    openProjects.append(project)


        return render_template('website/index.html', error=error, success=success, openProjects=openProjects)

    @app.route('/contact', methods=('GET', 'POST'))
    def contact():
        error = []
        success = []
        projects = session['projects']

        if request.method == "GET":
            return render_template('website/contact.html', error=error, success=success, projects=projects)
        elif request.method == "POST":
            msg = Message("Message from COVIDEO Contact Form", sender=('deckerfabian@ymail.com'), recipients=['covideo@franconia-film.de'])
            msg.html = "First Name: " + escape(request.form['firstName']) + "<br>"\
                "Last Name: " + escape(request.form['lastName'])  + "<br>"\
                "E-Mail: " + escape(request.form['email'])  + "<br>"\
                "Message: " + escape(request.form['message'])

            mail.send(msg)
            success.append("Thank you. Your message has been received")
            return render_template('website/contact.html', error=error, success=success, projects=projects)

    @app.route('/features')
    def features():
        error = []
        success = []
        projects = session['projects']

        return render_template('website/features.html', error=error, success=success, projects=projects)

    from . import db
    db.init_app(app)


    from . import viewer
    app.register_blueprint(viewer.bp)


    from . import login
    app.register_blueprint(login.bp)


    from . import api
    app.register_blueprint(api.bp)

    @app.route('/logout')
    def logout():
        session.pop('username', None)
        session.pop('projects', None)
        session.pop('current_project', None)
        return redirect(url_for('index'))


    return app
