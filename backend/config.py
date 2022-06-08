import os 

SECRET_KEY = os.urandom(32) 
# Indique le dossier dans lequel scripts s’exécute
basedir = os.path.abspath(os.path.dirname(__file__)) 
# Activer le mode debug
DEBUG = True 
# Connexion à la base de données
SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:postgres@localhost:5432/bricolappdb' 
# désactiver le système d’évènement/warning de Flask-SQLAlchemy 
SQLALCHEMY_TRACK_MODIFICATIONS = False