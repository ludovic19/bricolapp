from init_db import init_db
from models.model_db import *
from database import db_session

init_db() # remise à zéro de la base de données
session = db_session() # création du curseur d'accès à la base de données

listInterest = ['Menuiserie', 'Jardin', 'Maçonnerie', 'Plomberie', 'Electricité']
createInterests = []
for element in listInterest:
    createInterests.append(Interest(nom=element))

session.add_all(createInterests)
session.commit()
session.close()
print("Interest Add !")