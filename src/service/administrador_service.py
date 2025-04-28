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


#insertar administrador y login
def insertar_administrador_y_login(db: Session, administrador: AdministradorCreate):
    try:
        # Crear un nuevo registro en la tabla empleados
        nuevo_administrador = tables_model.Administrador(
            Id_administrador = administrador.Id_administrador,
            imagen_perfil = administrador.imagen_perfil,
            nombre = administrador.nombre,
            apellido = administrador.apellido,
            correo = administrador.correo,
            contrasena = administrador.contrasena,
            telefono = administrador.telefono,
            rol = administrador.rol
            
        )
        db.add(nuevo_administrador)
        db.flush()  # Esto asegura que el ID del empleado esté disponible

        # Crear un nuevo registro en la tabla login
        nuevo_login = tables_model.Login(
            id=nuevo_administrador.id,  # Usamos el ID del empleado recién creado
            correo=nuevo_administrador.correo,
            contrasena=nuevo_administrador.contrasena,
            rol=nuevo_administrador.rol  # Por defecto el empleado es un empleado normal (no admin)
        )
        db.add(nuevo_login)

        # Confirmar la transacción
        db.commit()
        return {"mensaje": "administrador y login creados exitosamente"}
    except Exception as e:
        db.rollback()  # Revertir la transacción en caso de error
        return {"error": str(e)}