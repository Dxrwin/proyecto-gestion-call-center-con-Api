#importamos las dependencias necesarias
from sqlalchemy.orm import Session
from src.databases import tables_model
from src.models.horario_schema import HorarioCreate
from fastapi import HTTPException


#obtener todos los horarios
def get_empleados(db:Session):
    return db.query(tables_model.Empleado).all()

#obtener  horario por id empleado
def get_empleado_por_id(db, id: int):
    return db.query(tables_model.Empleado).filter(tables_model.Empleado.id == id).first()

#crear horario
def create_horario_empleado(db:Session, horario_empleado:HorarioCreate):
    db_horario_empleado=tables_model.Empleado(**horario_empleado.dict())#convertimos el modelo pydantic a Orm
    #ingresamos el id,correo,contrasena y rol a la base de datos
    db.add(db_horario_empleado)
    db.commit()
    db.refresh(db_horario_empleado)
    return db_horario_empleado