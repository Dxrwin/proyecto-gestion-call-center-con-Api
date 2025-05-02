from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.databases.db import SessionLocal
from src.service import intercambio_horario_service
from src.models.intercambioHorario_schema import IntercambioHorarioCreate,IntercambioHorarioOut

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
@router.post("/intercambioHorario", response_model=IntercambioHorarioOut)
def crear_Empleado(intercambio: IntercambioHorarioCreate,db: Session = Depends(get_db)):
    db_intercambio = intercambio_horario_service.create_request_intercambio(db,intercambio)
    
    if not db_intercambio:
        print("status_code=400, error al crear el empleado")
        raise HTTPException(status_code=400, detail="error al insertar el empleado")
    return db_intercambio


#ruta para obtener todos los intercambio de horarios
@router.get("/getintercambioHorario", response_model=list[IntercambioHorarioOut])
def obtenerIntercambioHorarios(db: Session = Depends(get_db)):
    intercambios = intercambio_horario_service.get_intercambios(db)
    return intercambios

#obtener los intercambios por el id, para renderizar las solicitudes del empleado que tenga la sesion abierta
@router.get("/intercambio/{intercambio_id}", response_model=list[IntercambioHorarioOut])
def obtener_intercambio_por_id(intercambio_id: int, db: Session = Depends(get_db)):
    intercambio = intercambio_horario_service.get_intercambio_por_id(db, intercambio_id)
    if not intercambio:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return intercambio