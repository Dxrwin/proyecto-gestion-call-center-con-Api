from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.databases.db import SessionLocal
from src.service import empleado_service
from src.models.empleado_schema import EmpleadoCreate, EmpleadoOut

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
@router.post("/empleado", response_model=EmpleadoOut)
def crear_Empleado(empleado: EmpleadoCreate, db: Session = Depends(get_db)):
    db_empleado = empleado_service.create_empleado(db,empleado)
    
    if not db_empleado:
        print("status_code=400, error al crear el empleado")
        raise HTTPException(status_code=400, detail="error al insertar el empleado")
    return db_empleado

#ruta para obtener todos los empleados
@router.get("/empleado", response_model=list[EmpleadoOut])
def obtenerEmpleados(db: Session = Depends(get_db)):
    empleados = empleado_service.get_empleados(db)
    return empleados
