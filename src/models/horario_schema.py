#importamos la clase base de pydantic para crear los modelos de datos
from pydantic import BaseModel


#modelo base para la reutilizacion (sin campo id)
class HorarioEmpleadoBase(BaseModel):
    fecha_ingreso: str
    fecha_salida: str
    evento:str
    motivo:str
    estado:str
    fecha_solicitud:str
    
    
    
#modelo que incluye el campo id para la creacion
class HorarioCreate(HorarioEmpleadoBase):
    id:int

#modelo para respuestas, con configuracion para usar orm
class HorarioEmpleadoOut(HorarioEmpleadoBase):
    id: int
    #id del empleado al que pertenece el horario
    #id_empleado: int
    
    class Config:
        orm_mode = True
    