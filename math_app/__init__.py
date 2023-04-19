import os
from flask import Flask
from flask_graphql import GraphQLView
from flask_cors import CORS
from .schema import schema


# from flask_cors import CORS


def create_app(test_config=None):
  # create and configure the app
  app = Flask(__name__, instance_relative_config=True)
  CORS(app)
  app.debug = True

  app.config.from_mapping(
      SECRET_KEY=os.environ["FLASK_KEY"],
  )

  #graphql GUI
  app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True # for having the GraphiQL interface
    )
)


  #https://stackoverflow.com/questions/44532557/flask-import-app-from-parent-directory
  # with app.app_context():
  from .controllers.base import base_bp
  from .controllers.api import api_bp

  app = Flask(__name__, static_folder='static', static_url_path='/static')
  CORS(app)

  app.register_blueprint(base_bp)
  app.register_blueprint(api_bp)
  # app.register_blueprint(printing.bp)

  return app
