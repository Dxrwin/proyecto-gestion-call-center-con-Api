#importamos las dependencias necesarias
from sqlalchemy.orm import Session
from src.databases import tables_model
from src.models.empleado_schema import EmpleadoCreate

#obtener todos los empleados
def get_empleados(db:Session):
    return db.query(tables_model.Empleado).all()

#obtener empleado por id
def get_empleado(db: Session, id: int):
    return db.query(tables_model.Empleado).filter(tables_model.Empleado.id == id).first()

#crear empleado
def create_empleado(db:Session, empleado:EmpleadoCreate):
    db_empleado=tables_model.Empleado(**empleado.dict())#convertimos el modelo pydantic a Orm
    db.add(db_empleado)
    db.commit()
    db.refresh(db_empleado)
    return db_empleado