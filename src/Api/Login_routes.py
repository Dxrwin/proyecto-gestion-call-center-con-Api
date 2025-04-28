#importamos dependencias necesarias
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.databases.db import SessionLocal
from src.service import login_service
from src.models.login_schema import LoginOut, LoginBase

#creamos un router para agrupar las rutas de login
router = APIRouter()

#dependencia para obtener la sesion de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
#ruta para obtene datos por  correo contrasena y rol de empleado o administrador
@router.post("/obtenerlogin", response_model=LoginOut)
def obtenerLogin(login:LoginBase, db: Session = Depends(get_db)):
    login = login_service.obtener_login_correo_contrasena_rol(login.correo, login.contrasena,db)
    if not login:
        print("status_code=400, error al obtener el login")
        raise HTTPException(status_code=400, detail="Error: no se encontro el login Credenciales incorrectas")
    return login

#obtener todos los registros de la tabla login
@router.get("/obtenertodoslogin", response_model=list[LoginOut])
def obtenerTodosLogin(db: Session = Depends(get_db)):
    login = login_service.obtener_todos_registros_login(db)
    if not login:
        print("status_code=400, error al obtener los registros de login")
        raise HTTPException(status_code=400, detail="error al obtener los registros de login")
    return login