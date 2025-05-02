from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.databases.db import SessionLocal
from src.service import horario_empleado_service
from src.models.horario_schema import HorarioCreate,HorarioEmpleadoOut

#creamos un router para agrupar las rutas de empleado
router = APIRouter()

#dependencia para obtener la sesion de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
#ruta para crear un horario
@router.post("/horario", response_model=HorarioEmpleadoOut)
def crear_Empleado(Horario_empleado: HorarioCreate, db: Session = Depends(get_db)):
    db_horario_empleado = horario_empleado_service.create_horario_empleado(db,Horario_empleado)
    
    if not db_horario_empleado:
        print("status_code=400, error al crear el horario empleado")
        raise HTTPException(status_code=400, detail="error al insertar el horario del empleado")
    return db_horario_empleado