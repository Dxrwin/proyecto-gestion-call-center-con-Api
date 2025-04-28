#importamos la clase base de pydantic
from pydantic import BaseModel

#modelo base para reutilizacion (sin campo codigo)
class IntercambioHorarioBase(BaseModel):
    id_empleado: int
    id_empleado_intercambio: int
    fecha_intercambio: str
    fecha_solicitud: str
    estado: str
    motivo: str
    fecha_respuesta: str
    
#modelo que incluye el campo id para la creacion
class IntercambioHorarioCreate(IntercambioHorarioBase):
    id: int
    
#modelo para respuestas, con configuracion para usar orm
class IntercambioHorarioOut(IntercambioHorarioBase):
    id: int
    #id del empleado al que pertenece el intercambio de horario
    #id_empleado: int
    #id del empleado al que se le intercambia el horario
    #id_empleado_intercambio: int
    
    class Config:
        orm_mode = True