#importamos las librerias necesarias
from sqlalchemy.orm import Session
from src.databases import tables_model
from src.models.administrador_schema import AdministradorCreate,AdministradorBase
from fastapi import HTTPException


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

#obtener los datos del administrador
def obtener_datos_administrador(db: Session, id_administrador: int):
    try:
        administrador = db.query(tables_model.Administrador).filter(tables_model.Administrador.id == id_administrador).first()
        
        if not administrador:
            raise HTTPException(status_code=404, detail="Administrador no encontrado")
            
        return {
            "id": administrador.id,
            "nombre": administrador.nombre,
            "apellido": administrador.apellido,
            "correo": administrador.correo,
            "telefono": administrador.telefono,
            "rol": administrador.rol,
            "imagen_perfil": administrador.imagen_perfil
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener datos del administrador: {str(e)}")






#insertar administrador y login
def insertar_administrador_y_login(db: Session, administrador: AdministradorCreate):
    try:
        # Crear un nuevo registro en la tabla administradores
        nuevo_administrador = tables_model.Administrador(
            Id_administrador=administrador.Id_administrador,
            imagen_perfil=administrador.imagen_perfil,
            nombre=administrador.nombre,
            apellido=administrador.apellido,
            correo=administrador.correo,
            contrasena=administrador.contrasena,
            telefono=administrador.telefono,
            rol=administrador.rol
        )
        db.add(nuevo_administrador)
        db.flush()  # Esto asegura que el ID del administrador esté disponible

        # Crear un nuevo registro en la tabla login
        nuevo_login = tables_model.Login(
            id_administrador=nuevo_administrador.id,  # Establecemos la llave foránea
            id_empleado=None,  # Como es un administrador, esta llave foránea es nula
            correo=nuevo_administrador.correo,
            contrasena=nuevo_administrador.contrasena,
            rol=nuevo_administrador.rol
        )
        db.add(nuevo_login)

        # Confirmar la transacción
        db.commit()
        db.refresh(nuevo_administrador)
        return {"mensaje": "Administrador y login creados exitosamente", "administrador": nuevo_administrador}
    except Exception as e:
        db.rollback()  # Revertir la transacción en caso de error
        raise HTTPException(status_code=400, detail=f"Error al insertar el administrador: {str(e)}")