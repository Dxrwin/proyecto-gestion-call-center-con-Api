#importamos la clase base de pydantic para crear los modelos de datos
from pydantic import BaseModel
from datetime import datetime


#modelo base para la reutilizacion (sin campo id)
class HorarioEmpleadoBase(BaseModel):
    #id llave roranea que referencia a empleado
    #id_empleado :int
    #no se coloca id ya que dinamicamente en la funcion crear empleado al crear el horario heredara el id de empleado
    #y el id del registro se crea autoamticamente
    tipo_evento :str
    
    titulo_evento :str
    
    hora_ingreso : datetime
    #registrar la salida en el horario
    hora_salida : datetime
    #registrar los eventos solicitados por el administrador
    descripcion :str
    
    
    
#modelo que incluye el campo id para la creacion
class HorarioCreate(HorarioEmpleadoBase):
    #en dado caso si queremos colocar el id manualmente en una peticion debemos descomentar los id
    #id:int
    #id_empleado:int
    pass
    


#modelo para respuestas, con configuracion para usar orm
class HorarioEmpleadoOut(HorarioEmpleadoBase):
    id: int
    id_empleado:int
    #id_empleado: int
    
    class Config:
        orm_mode = True
    