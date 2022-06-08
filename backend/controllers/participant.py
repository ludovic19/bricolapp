from models.model_db import *
from database import *
from models.model_db import *
from sqlalchemy import *

def postparticipant(surnom, question, identifiant):
    session = engine.connect()
    selecta = select([User.id]).where(User.surnom == surnom).limit(1).scalar_subquery()
    selectb = select([Question.id]).where(Question.titre == question).limit(1).scalar_subquery()
    inserta = insert(Conversation).values(id_question = selectb)
    selectc = select([Conversation.id]).where(Conversation.id_question == selectb).limit(1).scalar_subquery()
    updatea = update(Participant).values(id_user = selecta, id_conversation = selectc, is_admin= True).where(Participant.identifiant_anonyme == identifiant)
    session.execute(inserta)
    session.execute(updatea)
    session.close()
    print("Add participant to the database")