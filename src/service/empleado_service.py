#importamos las dependencias necesarias
from sqlalchemy.orm import Session
from src.databases import tables_model
from src.models.empleado_schema import EmpleadoCreate
from src.models.horario_schema import HorarioCreate
from fastapi import HTTPException


#obtener todos los empleados
def get_empleados(db:Session):
    return db.query(tables_model.Empleado).all()

#obtener empleado por id
def get_empleado_por_id(db, id: int):
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
def insertar_empleado_y_login(db: Session, empleado: EmpleadoCreate,horario:HorarioCreate):
    try:
        # Crear un nuevo registro en la tabla empleados
        nuevo_empleado = tables_model.Empleado(
            id = empleado.id,  # Asignar el id para el registro en la tabla empleados
            Id_empleado = empleado.Id_empleado,
            #imagen_perfil = empleado.imagen_perfil,
            nombre = empleado.nombre,
            apellido = empleado.apellido,
            fecha_nacimiento = empleado.fecha_nacimiento,
            correo = empleado.correo,
            contrasena = empleado.contrasena,
            telefono = empleado.telefono,
            contacto_emergencia = empleado.contacto_emergencia,
            telefono_emergencia = empleado.telefono_emergencia,
            #habilidades = empleado.habilidades,
            fecha_contratacion = empleado.fecha_contratacion,
            area = empleado.area,
            descripcion_funciones=empleado.descripcion_funciones,
            salario = empleado.salario,
            posicion = empleado.posicion,
            estado = empleado.estado,  # Por defecto el empleado está activo (true)
            rol = empleado.rol  # Por defecto el empleado es un empleado normal (no admin)
        )
        db.add(nuevo_empleado)
        db.flush()  # Esto asegura que el ID del empleado esté disponible

        # Crear un nuevo registro en la tabla login
        nuevo_login = tables_model.Login(
            id_empleado=nuevo_empleado.id,  # Establecemos la llave foránea
            id_administrador=None,  # Como es un empleado, esta llave foránea es nula
            correo=nuevo_empleado.correo,
            contrasena=empleado.contrasena,
            rol=empleado.rol  # Por defecto el empleado es un empleado normal (no admin)
        )
        db.add(nuevo_login)
        db.flush()
        nuevo_horario = tables_model.HorarioEmpleado(
            id_empleado=nuevo_empleado.id,
            tipo_evento=horario.tipo_evento,
            titulo_evento=horario.titulo_evento,
            hora_ingreso=horario.hora_ingreso,
            hora_salida=horario.hora_salida,
            descripcion=horario.descripcion
        )
        db.add(nuevo_horario)
        # Confirmar la transacción
        db.commit()
        db.refresh(nuevo_empleado)
        db.refresh(nuevo_login)
        db.refresh(nuevo_horario)# Actualizamos el objeto con los datos de la base de datos
        return nuevo_empleado  # Devolvemos el objeto Empleado completo
    except Exception as e:
        db.rollback()  # Revertir la transacción en caso de error
        raise HTTPException(status_code=400, detail=str(e))  # Lanzamos una excepción HTTP con el error


