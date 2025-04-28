from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.databases.db import SessionLocal
from src.service import administrador_service
from src.models.administrador_schema import AdministradorCreate, AdministradorOut

#creamos un router para agrupar las rutas de empleado
router = APIRouter()

#dependencia para obtener la sesion de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
#ruta para crear un empleado
@router.post("/administrador", response_model=AdministradorOut)
def crear_Empleado(administrador: AdministradorCreate, db: Session = Depends(get_db)):
    db_empleado = administrador_service.create_administrador(db,administrador)
    
    if not db_empleado:
        print("status_code=400, error al crear el empleado")
        raise HTTPException(status_code=400, detail="error al insertar el empleado")
    return db_empleado




#ruta para insertar administrador y login
@router.post("/administradorylogin", response_model=dict)
def insertar_admin_y_login(administrador:AdministradorCreate, db: Session = Depends(get_db)):
    db_administrador = administrador_service.insertar_administrador_y_login(db, administrador)
    
    if "error" in db_administrador:
        raise HTTPException(status_code=400, detail="error al insertar el administrador")
    return db_administrador



#ruta para obtener todos los empleados
@router.get("/administradores", response_model=list[AdministradorOut])
def obteneradministradores(db: Session = Depends(get_db)):
    administradores = administrador_service.get_administradores(db)
    return administradores