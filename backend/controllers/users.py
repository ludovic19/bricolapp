from models.model_db import *
from database import *
from sqlalchemy import *


def postusers(surnom):
    session = engine.connect()
    inserta = insert(User).values(surnom = surnom, is_connected = True)
    session.execute(inserta)
    session.close()
    print("Add user to the database")


def getusers(surnom):
    session = engine.connect()
    selecta = select([User.surnom]).where(User.surnom == surnom).limit(1).scalar_subquery()
    inserta = update(User).values(is_connected = True).where(User.surnom == selecta)
    session.execute(inserta)
    session.close()
    print("User connected to the room")

def verifuser(surnom):
    res = db_session.query(User).filter(User.surnom == surnom).first()
    db_session.close()
    return res

def postinscription(surnom, nom, prenom, mail, pw_hash, rgpd):
    session = engine.connect()
    inserta = insert(User).values(nom=nom, prenom=prenom, surnom=surnom, email=mail, password=pw_hash, accord_rgpd=rgpd)
    session.execute(inserta)
    session.close()
    print("add new user to db")


def updateinscription(surnom, nom, prenom, email, pw_hash, rgpd):
    session = engine.connect()
    selecta = select([User.surnom]).where(User.surnom == surnom).limit(1).scalar_subquery()
    updatea = update(User).values(nom=nom, prenom=prenom, email=email, password=pw_hash).where(User.surnom == selecta, accord_rgpd=rgpd)
    session.execute(updatea)
    session.close()
    print('update new user')


# def getinformation(mail):
#     mes_information = db_session.query(User).filter(User.email == mail).first()
#     res = []
#     for info in mes_information:
#         res.append(info.surnom, info.nom, info.prenom, info.password)
#     return res
    
def postinformation(surnom, nom, prenom,password, mail):
    session = engine.connect()
    if surnom != '':
        updatea = update(User).values(surnom=surnom).where(User.email == mail)
        session.execute(updatea)
    elif nom != '':
        updatea = update(User).values(nom=nom).where(User.email == mail)
        session.execute(updatea)
    elif prenom != '':
        updatea = update(User).values(prenom=prenom).where(User.email == mail)
        session.execute(updatea)
    elif password != '':
        updatea = update(User).values(password=password).where(User.email == mail)
        session.execute(updatea)
    session.close()
    print('update user')
    
    
    
def getloginpage(mail):
    mail_nom = User.query.all()
    for element in mail_nom:
        if element.mail == mail:
            res = element.mail
            return res

# def getloginpage(mail, pw_hash):
#     session = engine.connect()
#     selecta = select([User.mail]).where(User.mail==mail).limit(1).scalar_subquery()
#     updatea = select([User].values(mail=mail, password=pw_hash)).where(User.mail == selecta)
#     session.execute(updatea)
#     session.close()
#     print('update mail')
