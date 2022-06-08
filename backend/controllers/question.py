from models.model_db import *
from database import *
from sqlalchemy import *


def postquestion(question, interest, identifiant):
    session = engine.connect()
    selecta = select([Interest.id]).where(Interest.nom == interest).limit(1).scalar_subquery()
    inserta = insert(Participant).values(identifiant_anonyme = identifiant)
    selectb = select([Participant.identifiant_anonyme]).where(Participant.identifiant_anonyme == identifiant).limit(1).scalar_subquery()
    insertb = insert(Question).values(titre = question, id_interest = selecta, auteur = selectb)
    session.execute(inserta)
    session.execute(insertb)
    session.close()
    print("Add question to the database")
