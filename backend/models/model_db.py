from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, Column, Integer, ForeignKey, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Interest(Base): 
    __tablename__ = 'interests' 
    id = Column(Integer, primary_key=True)
    nom = Column(String(256))
    def __init__(self, nom):
        self.nom = nom

        
class Question(Base): 
    __tablename__ = 'questions' 
    id = Column(Integer, primary_key=True)
    titre = Column(String(256))
    id_interest =Column(Integer, ForeignKey(Interest.id))
    auteur = Column(String(300), ForeignKey('participants.identifiant_anonyme'))
    def __init__(self, id_interest, titre):
        self.id_interest = id_interest
        self.titre = titre


class Conversation(Base):
    __tablename__ = 'conversations' 
    id = Column(Integer, primary_key=True)
    id_question = Column(Integer, ForeignKey(Question.id, use_alter=True))
    date_creation = Column(DateTime(), default=datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ"))
    def __init__(self, id_question, date_creation):
        self.id_question = id_question
        self.date_creation = date_creation


class Participant(Base):
    __tablename__ = 'participants' 
    id = Column(Integer, primary_key=True)
    id_user = Column(Integer, ForeignKey('users.id', use_alter=True))
    id_conversation = Column(Integer, ForeignKey(Conversation.id, use_alter=True))
    is_admin = Column(Boolean)
    questions = relationship(Question, cascade="all, delete")
    identifiant_anonyme = Column(String(300), nullable=True, unique=True)
    def __init__(self, id_user, id_conversation, is_admin, identifiant_anonyme):
        self.id_user = id_user
        self.id_conversation = id_conversation
        self.is_admin = is_admin
        self.identifiant_anonyme = identifiant_anonyme
        
class Message(Base): 
    __tablename__ = 'messages' 
    id = Column(Integer, primary_key=True)
    contenu = Column(String(1000))
    date_envoi = Column(DateTime(), default=datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ"))
    pictures = Column(String(320))
    id_conversation = Column(Integer, ForeignKey(Conversation.id, use_alter=True))
    id_participant = Column(Integer, ForeignKey(Participant.id, use_alter=True))
    surnom = Column(String(60))
    def __init__(self, id_participant, content, date_envoi, id_conversation):
        self.id_conversation = id_conversation
        self.date_envoi = date_envoi
        self.content = content
        self.id_participant = id_participant

        
class User(Base): 
    __tablename__ = 'users' 
    id = Column(Integer, primary_key=True)
    nom = Column(String(64))
    prenom = Column(String(64))
    surnom = Column(String(64))
    email  = Column(String(256))
    password = Column(String(256))
    date_creation = Column(DateTime(), default=datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ"))
    date_modification = Column(DateTime(), default=datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ"))
    accord_rgpd = Column(Boolean)
    is_connected = Column(Boolean)
    is_connected_session = Column(Boolean)
    participants = relationship(Participant, cascade="all, delete")
    interests = relationship('Interest', secondary='user_interests', cascade="all, delete")
    contacts = relationship('Contact', secondary='contacts', primaryjoin='User.id == Contact.id_user', secondaryjoin='User.id == Contact.id_contact', cascade="all, delete")
    messages = relationship('Message', secondary='participants', overlaps="participants", cascade="all, delete")
    conversations = relationship('Conversation', secondary='participants', overlaps="messages,participants", cascade="all, delete")
    questions = relationship('Question', secondary='participants', primaryjoin='User.id == Participant.id_user', secondaryjoin='Question.auteur == Participant.id_user', overlaps="conversations,messages,participants", cascade="all, delete")
    def init(self, nom, prenom, email,date_creation, is_connected, surnom):
        self.nom = nom
        self.prenom = prenom 
        self.email = email
        self.date_creation = date_creation
        self.is_connected = is_connected
        self.surnom = surnom
          
class Contact(Base):
    __tablename__ = 'contacts'
    id = Column(Integer, primary_key=True)
    id_user = Column(Integer, ForeignKey(User.id, use_alter=True))
    id_contact = Column(Integer, ForeignKey(User.id, use_alter=True))
    def __init__(self,id_user, id_contact):
        self.id_user = id_user
        self.id_contact = id_contact

class User_interest(Base): 
    __tablename__ = 'user_interests' 
    id = Column(Integer, primary_key=True)
    id_user = Column(Integer, ForeignKey(User.id, use_alter=True))
    id_interest = Column(Integer, ForeignKey(Interest.id, use_alter=True))
    def init(self, id_user,id_interest):
        self.id_user = id_user
        self.id_interst = id_interest