# Errores en tu código actual:
# - data.email debería ser data.get('email')
# - No estás retornando el token en /signup
# - request.get_json falta paréntesis en /login

# CÓDIGO CORREGIDO:
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)


@api.route('/signup', methods=['POST']) 
def signup():
    data = request.get_json()
    email = data.get('email')  
    password = data.get('password')  
    
    if not email or not password:
        return jsonify({'error': 'Email y contraseña son requeridos'}), 400
    
    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        return jsonify({'error': 'Ya existe el usuario'}), 400
    
    try:
        usuario = User(email=email, password=password)
        db.session.add(usuario)
        db.session.commit()
        
        
        token = create_access_token(identity=email)
        return jsonify({'message': 'Usuario creado exitosamente', 'token': token}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/login', methods=["POST"])
def login():
    data = request.get_json()  
    email = data.get('email')  
    password = data.get('password')  
    
    if not email or not password:
        return jsonify({'error': 'Email y contraseña son requeridos'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'No existe el usuario'}), 404
    
    try:
        if user.password == password:
            token = create_access_token(identity=email)
            return jsonify({'message': 'Éxito al iniciar sesión', 'token': token}), 200
        else:
            return jsonify({'error': 'Contraseña incorrecta'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/verificar_jwt',methods=["GET"])
@jwt_required()
def verificar_jwt():
    try:
        email = get_jwt_identity()
        usuario = User.query.get(email)
        if not usuario:
            return jsonify({"error": "El token no es valido"}), 404
        else:
            return jsonify({"exito":"el token es válido", "email" : email }), 200
    except Exception as e:
        return jsonify({"error": f"Error al verificar token: {str(e)}"}), 500
    
@api.route('/user', methods=["GET"])
@jwt_required() 
def getUser():
    email = get_jwt_identity()
    if email:
        return jsonify({'email':email}), 200
    else:
        return jsonify({'error':'no se ha encontrado el usuario'}), 404