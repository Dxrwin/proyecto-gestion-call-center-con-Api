#importamos las librerias necesarias
from sqlalchemy.orm import Session
from src.databases import tables_model
from src.models.administrador_schema import AdministradorCreate


#trae todos los administradores
def get_administradores(db:Session):
    return db.query(tables_model.Administrador).all()

#trae todos los administradores por id
def get_administrador(db: Session, id: int):
    return db.query(tables_model.Administrador).filter(tables_model.Administrador.id == id).first()


#crea un administrador
def create_administrador(db:Session, administrador:AdministradorCreate):
    db_administrador=tables_model.Administrador(**administrador.dict())
    db.add(db_administrador)
    db.commit()
    db.refresh(db_administrador)
    return db_administrador