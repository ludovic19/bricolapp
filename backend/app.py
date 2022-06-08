from re import A
from webbrowser import get
from flask import Flask, request, jsonify, Blueprint, send_file
from flask_socketio import SocketIO, send , emit, join_room, leave_room
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import *
from database import *
from models.model_db import *
from controllers.interest import *
from controllers.question import *
from controllers.users import *
from controllers.participant import *
from controllers.message import *
import datetime
from werkzeug.utils import secure_filename 
from werkzeug.datastructures import FileStorage
import psycopg2
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt, generate_password_hash, check_password_hash
from uuid import UUID, uuid4
import os
import time 
import pickle



app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
app.config.from_object('config')
app.config["JWT_SECRET_KEY"] = "@aurelie@taous@ludovic@farid@ziyad@tf2"
app.config['SECRET_KEY'] = '@aurelie@taous@ludovic@farid@ziyad@tf2'
UPLOAD_FOLDER = 'uploadFile'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
jwt = JWTManager(app)
socket_io = SocketIO(app, cors_allowed_origins="*", logger=True)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def make_unique(string):
    ident = uuid4()
    my_tuple = string.partition(".")
    return f"{ident}" + f"{my_tuple[-2]}" + f"{my_tuple[-1]}"

@app.route("/api/interest", methods=["GET"])
def interest_info():
    data = getInterest()
    return {"interest": data}

@app.route("/api/interestdata", methods=["POST"])
def interest_data():
    interest = request.json["interestSelected"]
    question = request.json["questions"]
    surnom = request.json["surnom"]
    anonymous = request.json["checkboxAnonymous"]
    identhash = uuid4()
    identifiant = str(identhash)
    postquestion(question, interest, identifiant)
    postusers(surnom)
    postparticipant(surnom, question, identifiant)
    if surnom == "test":
        return jsonify({"msg": "Bad username or password"}), 401
    access_token = create_access_token(identity=surnom)
    return jsonify(access_token=access_token)

@app.route("/api/inscription", methods=["POST"])
def inscription():
    surnom = request.json["pseudo"]
    nom = request.json["nom"]
    prenom = request.json["prenom"]
    mail = request.json["mail"]
    password = request.json["password"]
    rgpd = request.json["checkboxRGPD"]
    if rgpd == "True":
        rgpd = True
        pw_hash = generate_password_hash(password).decode("utf8")
        surnomdb = getusers(surnom)
        if surnom == surnomdb: 
            updateinscription(surnom, nom, prenom, mail, pw_hash, rgpd)
            if mail == "test@test.com":
                return jsonify({"msg": "Bad username or password"}), 401
            access_token = create_access_token(identity=mail)
            return jsonify(access_token=access_token)
        else:
            postinscription(surnom, nom, prenom, mail,pw_hash, rgpd)
            if mail == "test@test.com":
                return jsonify({"msg": "Bad username or password"}), 401
            access_token = create_access_token(identity=mail)
            return jsonify(access_token=access_token)


@app.route("/api/loginpage", methods=["POST", "GET"])
def loginpage():
    con = engine.connect()
    if request.method == "POST":
        mail = request.json["mail"]
        password = request.json["password"]
        logout = request.json["logout"]
        mail_nom = db_session.query(User).filter(User.email == mail).first()
        check = check_password_hash(mail_nom.password, password)
        update1 = update(User).values(is_connected_session=True).where(User.email == mail)
        with open('file.pkl', 'wb') as f:
            pickle.dump(mail, f)
        if mail_nom.email == mail and check == True:
            con.execute(update1)
            con.close()
            db_session.close()
            access_token = create_access_token(identity=mail)
            return jsonify(access_token=access_token)
        else:
            db_session.close()
            access_token = create_access_token(identity=mail)
            return {access_token: access_token, 'msg': "Bad username or password"}
    elif request.method == 'GET':
        with open('file.pkl', 'rb') as f:
            mail = pickle.load(f)
        select = db_session.query(User.is_connected_session).filter(User.email == mail).first()
        if select[0] == True:
            update2 = update(User).values(is_connected_session=False).where(User.email == mail)
            con.execute(update2)
            con.close()
            db_session.close()
            return { 'login': False, 'logout': True }
        else: 
            return { 'login': True, 'logout': False }
        
        
@app.route("/api/interestidpost", methods=["POST"])
def interestidget():
    interest = request.json["url"]
    print("Interest: " + interest)
    # Partie extrait du dossier controllers car aucune solution possible de récupérer le centrer d'interet via une fonction
    myListtitre = []
    myListauteur = []
    myListuserid = []
    myListsurnom = []
    myListquestionid = []
    myListDate = []
    myListconected = []
    interestdata = db_session.query(Interest).filter(Interest.nom == interest).first()
    question = db_session.query(Question).filter(Question.id_interest == interestdata.id).all()
    for title in question:
        myListtitre.append(title.titre)
        myListauteur.append(title.auteur)
        myListquestionid.append(title.id)
        myListtitre.reverse()
        myListauteur.reverse()
        myListquestionid.reverse()
    participant = db_session.query(Participant).all()
    for iduser in participant:
        for auteur in myListauteur:
            if iduser.identifiant_anonyme == auteur:
                myListuserid.append(iduser.id_user)
                myListuserid.reverse()
    for pseudo in db_session.query(User).all():
        for id in myListuserid:
            if pseudo.id == id:
                myListsurnom.append(pseudo.surnom)
                myListconected.append(pseudo.is_connected)
                myListsurnom.reverse()
                myListconected.reverse()
    for element in db_session.query(Conversation).all():
        for id in myListquestionid:
            if element.id_question == id:
                datetime_date = datetime.strptime(str(element.date_creation), "%Y-%m-%d %H:%M:%S")
                myListDate.append(str(datetime_date))
                myListDate.reverse()
    db_session.close()
    taille = len(myListtitre)
    access_token = create_access_token(identity=interest)
    return {"access_token":access_token, "idquestion":myListquestionid, "question":myListtitre, "surnom":myListsurnom, "date":myListDate, "is_connected":myListconected, "taille":taille}
    
<<<<<<< HEAD
    
    


@app.route("/loginpage", methods=["GET"])
def loginpage_info():
    data = getloginpage()
    return {"loginpage": data}   


# @app.route("/loginpagedata", methods=["POST"])
# def loginpage():
#     mail = request.json["mail"]
#     password = request.json["password"]
#     pw_hash = generate_password_hash(password)
#     maildb = getloginpage(mail)
#     print(maildb)
#     if mail == maildb:
#         return jsonify({"msg": "Bad username or password"}), 401
#     access_token = create_access_token(identity=mail)
#     return jsonify(access_token=access_token)
       
   
    

=======
>>>>>>> ziyadg
@app.route("/api/information", methods=["GET", "POST"])
def information():
    mail = request.json["mail"]
    if request.method == "POST":
        surnom = request.json["pseudo"]
        nom = request.json["nom"]
        prenom = request.json["prenom"]
        password = request.json["password"]
        pw_hash = generate_password_hash(password)
        postinformation(surnom, nom, prenom, pw_hash, mail)
        access_token = create_access_token(identity=mail)
        return jsonify(access_token=access_token)
    if request.method == 'GET':
        mes_information = db_session.query(User).filter(User.email == mail).first()
        res = {}
        for info in mes_information:
            res.update({'surnom': info.surnom, 'nom': info.nom, 'prenom': info.prenom})
        print(res)
        return {'data':res}
<<<<<<< HEAD

if __name__ == "__main__":
    socket_io.run(app, debug=True)
=======
 
@app.route('/api/interestidsurnom', methods=["POST"])
def insertpseudo():
    invite = request.json['invite']
    question = request.json['question']
    postcreationsuser(invite, question)
    access_token = create_access_token(identity=invite)
    return jsonify(access_token=access_token)

@socket_io.on('connecte')
def test_connect():
    print("server/client connected")
    emit('message', {'data': 'Connected'})
    
@socket_io.on('disconected')
def test_disconnect():
    print("server/client disconnected")
    emit('message', {'data': 'Disconnected'})
    
@socket_io.on('tchat')
def postmessage(data):
    message = data['message']
    invite = data['invite']
    url = data['url']
    surnom = data['surnom']
    namefile = data['namefile']
    typefile = data['typefile']
    print(message, invite, url, surnom, namefile, typefile)
    if not message.startswith('<script>'):
        join_room(url)
        if namefile != "" and typefile != "":
            format = FileStorage(stream=None, 
                            filename=namefile, 
                            name=None, 
                            content_type=typefile,
                            content_length=None, 
                            headers=None)
            nfiles = make_unique(format.filename)
            if (allowed_file(nfiles)):
                filename = secure_filename(nfiles)
                format.save(os.path.join(UPLOAD_FOLDER, filename))
                if surnom == invite:
                    postmessageadmin(invite, url, message, nfiles) 
                else:
                    postmessage(invite, url, message, nfiles)          
        else:               
            if surnom == invite:
                postmessageadminnoimg(invite, url, message)
                
            else:
                postmessagenoimg(invite, url, message)    
    else:
        print("Message portant un script js")
        emit("deltext", {'data': 'Message portant un script js'})
    
@app.route('/api/tchating', methods=['POST'])
def getmessage():
    url = request.json["url"]
    data_message = getallmessage(url)
    access_token = create_access_token(identity=url)
    return jsonify(data=data_message, access_token=access_token)

@app.route('/api/firsttchating', methods=['POST'])
def firstmessage():
    url = request.json["url"]
    firstmessage(url)
    access_token = create_access_token(identity=url)
    return jsonify(access_token=access_token)


@app.route('/img/<filename>',methods = ['GET'])
def give(filename):
    filen = './uploadFile/'+filename
    return send_file(filen)
 

if __name__ == "__main__":
    socket_io.run(debug=True, host='localhost', port="5000")
>>>>>>> ziyadg


