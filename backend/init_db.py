from database import Base, engine, db_session
from models.model_db import *
from sqlalchemy import schema


def init_db():
    # Suppression de la base de données
    session = db_session()
    session.execute(schema.DropSchema(name='public', cascade=True)) 
    session.commit()
    print("DROP SCHEMA public")
    session.execute(schema.CreateSchema(name='public'))
    session.commit()
    print("CREATE SCHEMA public")
    # Création de la base de données
    Base.metadata.create_all(bind=engine)
    print("Create All tables")
            
if __name__=="__main__":
    init_db()