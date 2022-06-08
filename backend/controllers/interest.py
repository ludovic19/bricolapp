from models.model_db import Interest
from database import db_session

def getInterest():
    interest_nom = Interest.query.all()
    res = []
    for noms in interest_nom:
        res.append(noms.nom)
    db_session.close()    
    return res

def geturlinterest(interest):
    return interest