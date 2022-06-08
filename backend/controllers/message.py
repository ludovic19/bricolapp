from models.model_db import *
from database import *
from sqlalchemy import *

def postmessage(invite, id_question, contenu, pictures):
    session = engine.connect()
    user_id = select([User.id]).where(User.surnom == invite).limit(1).scalar_subquery()
    participation_id = select([Participant.id]).where(Participant.id_user == user_id).limit(1).scalar_subquery()
    conversation_id = select([Conversation.id]).where(Conversation.id_question == id_question).limit(1).scalar_subquery()
    insert_message = insert (Message).values(id_participant = participation_id, id_conversation = conversation_id, contenu = contenu,   pictures=pictures, surnom=invite)
    session.execute(insert_message)
    session.close()
    print("Message ajouter à la base de donnée")
    
def postmessageadmin(invite, id_question, contenu,  pictures):
    session = engine.connect()
    user_id = select([User.id]).where(User.surnom == invite).limit(1).scalar_subquery()
    participation_id = select([Participant.id]).where(Participant.id_user == user_id).limit(1).scalar_subquery()
    updatestatus = update(Participant).values(is_admin=True).where(Participant.id == participation_id)
    conversation_id = select([Conversation.id]).where(Conversation.id_question == id_question).limit(1).scalar_subquery()
    insert_message = insert (Message).values(id_participant = participation_id, id_conversation = conversation_id, contenu = contenu,   pictures=pictures, surnom=invite)
    session.execute(updatestatus)
    session.execute(insert_message)
    session.close()
    print("Message ajouter à la base de donnée")
    
def postmessagenoimg(invite, id_question, contenu):
    session = engine.connect()
    user_id = select([User.id]).where(User.surnom == invite).limit(1).scalar_subquery()
    participation_id = select([Participant.id]).where(Participant.id_user == user_id).limit(1).scalar_subquery()
    conversation_id = select([Conversation.id]).where(Conversation.id_question == id_question).limit(1).scalar_subquery()
    print(contenu)
    insert_message = insert (Message).values(id_participant = participation_id, id_conversation = conversation_id, contenu = contenu, surnom=invite)
    session.execute(insert_message)
    session.close()
    print("Message ajouter à la base de donnée")
    
def postmessageadminnoimg(invite, id_question, contenu):
    session = engine.connect()
    user_id = select([User.id]).where(User.surnom == invite).limit(1).scalar_subquery()
    participation_id = select([Participant.id]).where(Participant.id_user == user_id).limit(1).scalar_subquery()
    updatestatus = update(Participant).values(is_admin=True).where(Participant.id == participation_id)
    conversation_id = select([Conversation.id]).where(Conversation.id_question == id_question).limit(1).scalar_subquery()
    insert_message = insert (Message).values(id_participant = participation_id, id_conversation = conversation_id, contenu = contenu, surnom=invite)
    session.execute(updatestatus)
    session.execute(insert_message)
    session.close()
    print("Message ajouter à la base de donnée")

def postcreationsuser(invite, question):
    session = engine.connect()
    insert0 = insert(User).values(surnom=invite)
    selecta = select([User.surnom]).where(User.surnom == invite).limit(1).scalar_subquery()
    inserta = update(User).values(is_connected = True).where(User.surnom == selecta)
    selectb = select([User.id]).where(User.surnom == invite).limit(1).scalar_subquery()
    selectc = select([Participant.id_user]).where(Participant.id_user == selectb).limit(1).scalar_subquery()
    selectd = select([Question.id]).where(Question.titre == question[0]).limit(1).scalar_subquery()
    selectf = select([Conversation.id_question]).where(Conversation.id_question == selectd).limit(1).scalar_subquery()
    selectg = select([Conversation.id]).where(Conversation.id_question == selectf).limit(1).scalar_subquery()
    insertb = insert(Participant).values(id_conversation = selectg, id_user=selectb)
    selecth = select([Participant.id]).where(Participant.id_user == selectc).limit(1).scalar_subquery()
    session.execute(insert0)
    session.execute(inserta)
    session.execute(insertb)
    session.close()
    print("Ajout de l'utilisateur dans les table user, participant et message")


def getallmessage(id_question):
    myList_message = []
    id_conversation = db_session.query(Conversation.id).filter(Conversation.id_question == id_question).first()
    recup_message = db_session.query(Message).filter(Message.id_conversation == id_conversation[0]).order_by(Message.date_envoi.desc()).all()
    for instance in recup_message:
        if instance.pictures == None:
            instance.pictures = ""
            myList_message.append([instance.id, instance.contenu, str(instance.date_envoi), instance.pictures, instance.id_conversation, instance.id_participant, instance.surnom])
            db_session.close()
        else:
            myList_message.append([instance.id, instance.contenu, str(instance.date_envoi), instance.pictures, instance.id_conversation, instance.id_participant, instance.surnom])
            db_session.close()
    db_session.close()
    return myList_message

def firstmessage(id_question):
    id_conversation = db_session.query(Conversation.id).filter(Conversation.id_question == id_question).first()
    message = insert(Message).values(contenu="Message automatique", id_conversation=id_conversation[0], id_participant=1, date_envoi=datetime.datetime.now(), pictures="", surnom="admin")
    session = engine.connect()
    session.execute(message)
    session.close()
    print("Message ajouter à la base de donnée")