#importamos las dependencias necesarias 
from sqlalchemy.orm import Session
from src.databases import tables_model
from src.models.login_schema import LoginCreate, LoginOut


#obtener todos los registros de login
def obtener_todos_registros_login(db:Session):
    return db.query(tables_model.Login).all()

#obtener login por role
def obtener_login_rol(db: Session, role: str):
    return db.query(tables_model.Login).filter(tables_model.Login.rol == role).first()

#obtener login por correo por contraseña y rol
def obtener_login_correo_contrasena_rol(correo: str,contrasena: str,db: Session):
    return db.query(tables_model.Login).filter(tables_model.Login.correo == correo, tables_model.Login.contrasena == contrasena).first()
