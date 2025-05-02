#importamos las dependencias necesarias
from sqlalchemy.orm import Session
from src.databases import tables_model
from src.models.intercambioHorario_schema import IntercambioHorarioCreate
from fastapi import HTTPException


#obtener todos los intercambios de horario
def get_intercambios(db:Session):
    return db.query(tables_model.IntercambioHorario).all()

#obtener solicitud de intercambio por id
def get_intercambio_por_id(db, id: int):
    return db.query(tables_model.IntercambioHorario).filter(tables_model.IntercambioHorario.id_empleado_solicitado == id).all()

#crear solicitud para un intercambio
def create_request_intercambio(db:Session, horario:IntercambioHorarioCreate):
    db_intercambioHorario=tables_model.IntercambioHorario(**horario.dict())#convertimos el modelo pydantic a Orm
    #ingresamos el id,correo,contrasena y rol a la base de datos
    db.add(db_intercambioHorario)
    db.commit()
    db.refresh(db_intercambioHorario)
    return db_intercambioHorario