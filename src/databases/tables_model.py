#importamos de la libreria sqlalchemy los tipos de datos que vamos a usar
#importamos los tipos de columnas que vamos a usar y la clase Base que es la base para los modelos ORM
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from src.databases.db import Base



#definimos el modelo de la tabla empleado
class Empleado(Base):
    __tablename__ = "empleados"

    id = Column(Integer, primary_key=True, index=True)
    #id unico del empleado
    Id_empleado = Column(String, unique=True)
    imagen_perfil = Column(String)
    nombre = Column(String)
    apellido = Column(String)
    fecha_nacimiento = Column(String)
    correo = Column(String, unique=True)
    contrasena = Column(String)
    telefono = Column(String)
    contacto_emergencia = Column(String)
    telefono_emergencia = Column(String)
    habilidades = Column(String)
    fecha_contratacion = Column(String)
    area = Column(String)
    salario = Column(Integer)
    posicion = Column(String)
    estado = Column(String)
    rol = Column(String)
    #id del area de trabajo donde trabaja el empleado
    #el id del area de trabajo es una llave foranea que hace referencia a la tabla areas_trabajo
    #area_trabajo = Column(Integer, ForeignKey("areas_trabajo.id"))
    
    
    #realciones
    
    #relacion uno a muchos con la tabla rendimiento
    #rendimiento = relationship("Rendimiento", back_populates="empleado")
    #relacion uno a muchos con la tabla solicitudes de permisos
    #solicitudes_permisos = relationship("SolicitudPermiso", back_populates="empleado")
    #relacion uno a muchos con la tabla intercambios de horario
    #intercambios_horario = relationship("IntercambioHorario", back_populates="empleado")
    
    
    
    
    
    
#definimos el modelo de la tabla de rendimiento donde se almacenara datos numericos unicos del empleado para mostrar en graficas
class Rendimiento(Base):
    __tablename__ = "rendimiento_empleados"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(String)
    horas_trabajadas = Column(Integer)
    tareas_completadas = Column(Integer)
    tareas_asignadas = Column(Integer)
    tareas_pendientes = Column(Integer)
    timepo_respuesta = Column(Integer)
    tiempo_resolucion = Column(Integer)
    tiempo_espera = Column(Integer)
    tiempo_espera_respuesta = Column(Integer)
    tiempo_espera_resolucion = Column(Integer)
    tiempo_espera_tareas = Column(Integer)
    tiempo_descanso_total = Column(Integer)
    descansos = Column(Integer)
    descanso_1_15min = Column(Integer)
    descanso_2_15min = Column(Integer)
    descanso_almuerzo = Column(Integer)
    #la llave foranea que hace referencia a la tabla empleados
    #el id del empleado es una llave foranea que hace referencia a la tabla empleados
    #id_empleado = Column(Integer, ForeignKey("empleados.id"))
    
    
    #relacion uno a muchos con la tabla empleado
    #empleado = relationship("Empleado", back_populates="rendimiento")



    
#definimos el modelo de la tabla de solicitudes de perimos o de cualquier otro motivo del empleado
class SolicitudPermiso(Base):
    __tablename__ = "solicitudes_permisos"

    id = Column(Integer, primary_key=True, index=True)
    fecha_solicitud = Column(String)
    fecha_inicio = Column(String)
    fecha_fin = Column(String)
    motivo = Column(String)
    estado = Column(String)
    #id del empleado que genera la solicitud
    #el id del empleado es una llave foranea que hace referencia a la tabla empleados
    #id_empleado = Column(Integer, ForeignKey("empleados.id"))
    #id del administrador que aprueba la solicitud
    #el id del administrador es una llave foranea que hace referencia a la tabla administradores
    #id_administrador = Column(Integer, ForeignKey("administradores.id"))
    #id del empleado que recibe la solicitud
    #el id del empleado es una llave foranea que hace referencia a la tabla empleados
    #id_empleado_recibe = Column(Integer, ForeignKey("empleados.id"))
    
    #relacion uno a muchos con la tabla empleado
    #empleado = relationship("Empleado", back_populates="solicitudes_permisos")



    
#definimos el modelo de la tabla de horario del empleado
class HorarioEmpleado(Base):
    __tablename__ = "horarios_empleados"

    id = Column(Integer, primary_key=True, index=True)
    #registrar el ingreso en el horario
    fecha_ingreso = Column(String)
    #registrar la salida en el horario
    fecha_salida = Column(String)
    #registrar los eventos solicitados por el administrador
    evento = Column(String)
    #registrar el motivo del evento
    motivo = Column(String)
    #registrar el estado del evento
    estado = Column(String)
    #registar la fecha de la solicitud del evento
    fecha_solicitud = Column(String)
    
    #id del empleado que le pertenece el horario
    #el id del empleado es una llave foranea que hace referencia a la tabla empleados
    #id_empleado = Column(Integer, ForeignKey("empleados.id"))
    #id del administrador que genera el evento
    #el id del administrador es una llave foranea que hace referencia a la tabla administradores
    #id_administrador = Column(Integer, ForeignKey("administradores.id"))
    
    
    #relacion uno a muchos con la tabla empleado
    #empleado = relationship("Empleado", back_populates="horario_empleado")




    
#definimos el modelo de la tabla de intercambio de horario del empleado con otro empleado
class IntercambioHorario(Base):
    __tablename__ = "intercambios_horario"

    id = Column(Integer, primary_key=True, index=True)
    #id del empleado que solicita el intercambio de horario
    #id_empleado = Column(Integer, ForeignKey("empleados.id"))
    #id del empleado que recibe el intercambio de horario
    #id_empleado_intercambio = Column(Integer, ForeignKey("empleados.id"))
    fecha_intercambio = Column(String)
    fecha_solicitud = Column(String)
    estado = Column(String)
    motivo = Column(String)
    fecha_respuesta = Column(String)
    #relacion uno a muchos con la tabla empleado
    #empleado = relationship("Empleado", back_populates="intercambios_horario")
    
    
    
#defimos el modelo de la tabla del area de trabajo donde trabaja el empleado
class AreaTrabajo(Base):
    __tablename__ = "areas_trabajo"

    id = Column(Integer, primary_key=True, index=True)
    
    nombre_area = Column(String, unique=True)
    descripcion = Column(String)
    #el area de trabajo tiene los id de los empleados que trabajan en esa area
    #id_empleado = Column(Integer, ForeignKey("empleados.id"))
    
    #relacion uno a muchos con la tabla empleado
    #empleados = relationship("Empleado", back_populates="area_trabajo")
    

#definimos el modelo de la tabla del administrador
class Administrador(Base):
    __tablename__ = "administradores"

    id = Column(Integer, primary_key=True, index=True)
    Id_administrador = Column(String, unique=True)
    imagen_perfil = Column(String)
    nombre = Column(String)
    apellido = Column(String)
    correo = Column(String, unique=True)
    contrasena = Column(String)
    direccion = Column(String)
    telefono = Column(String)
    rol = Column(String)
    #id del area de trabajo donde trabaja el administrador
    #el id del area de trabajo es una llave foranea que hace referencia a la tabla areas_trabajo
    #id_area_trabajo = Column(Integer, ForeignKey("areas_trabajo.id"))
    
    
    #relaciones
    #relacionar la tabla administrador con la tabla area de trabajo
    #area_trabajo = relationship("AreaTrabajo", back_populates="administrador")
    
#definimos el modelo de la tabla login para el empleado y el administrador
class Login(Base):
    __tablename__ = "login"

    id = Column(Integer, primary_key=True, index=True)
    id_empleado = Column(Integer, ForeignKey("empleados.id"), nullable=True)
    id_administrador = Column(Integer, ForeignKey("administradores.id"), nullable=True)
    correo = Column(String)
    contrasena = Column(String)
    rol = Column(String)
