import os

from flask import Flask, session, redirect, url_for
from datetime import timedelta

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

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
        app.permanent_session_lifetime = timedelta(hours=24 )

    @app.route('/')
    def index():
        return 'Hello, World!'

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
