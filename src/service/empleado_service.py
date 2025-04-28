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
    #ingresamos el id,correo,contrasena y rol a la base de datos
    db.add(db_empleado)
    db.commit()
    db.refresh(db_empleado)
    return db_empleado


#insertar empleado y login
def insertar_empleado_y_login(db: Session, empleado: EmpleadoCreate):
    try:
        # Crear un nuevo registro en la tabla empleados
        nuevo_empleado = tables_model.Empleado(
            id = empleado.id,  # Asignar el id para el registro en la tabla empleados
            Id_empleado = empleado.Id_empleado,
            imagen_perfil = empleado.imagen_perfil,
            nombre = empleado.nombre,
            apellido = empleado.apellido,
            fecha_nacimiento = empleado.fecha_nacimiento,
            correo = empleado.correo,
            contrasena = empleado.contrasena,
            telefono = empleado.telefono,
            habilidades = empleado.habilidades,
            fecha_contratacion = empleado.fecha_contratacion,
            salario = empleado.salario,
            posicion = empleado.posicion,
            estado = empleado.estado,  # Por defecto el empleado está activo (true)
            rol = empleado.rol  # Por defecto el empleado es un empleado normal (no admin)
        )
        db.add(nuevo_empleado)
        db.flush()  # Esto asegura que el ID del empleado esté disponible

        # Crear un nuevo registro en la tabla login
        nuevo_login = tables_model.Login(
            id=nuevo_empleado.id,  # Usamos el ID del empleado recién creado
            correo=nuevo_empleado.correo,
            contrasena=empleado.contrasena,
            rol=empleado.rol  # Por defecto el empleado es un empleado normal (no admin)
        )
        db.add(nuevo_login)

        # Confirmar la transacción
        db.commit()
        return {"mensaje": "Empleado y login creados exitosamente"}
    except Exception as e:
        db.rollback()  # Revertir la transacción en caso de error
        return {"error": str(e)}


