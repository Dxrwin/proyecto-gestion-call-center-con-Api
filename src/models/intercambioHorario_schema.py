#importamos la clase base de pydantic
from pydantic import BaseModel
from datetime import datetime

#modelo base para reutilizacion (sin campo codigo)
class IntercambioHorarioBase(BaseModel):
    #id del empleado que crea la solicitud
    id_empleado :int
    #fecha elejida en la interfaz 
    fecha_intercambio :datetime
    #el id a quien va dirigido la solicitud
    id_empleado_solicitado:int
    #fecha actual al generar la solicitud
    fecha_solicitud :datetime
    #nombre del solicitante
    Nombre_solicitante :str
    #descripcion o razon o mensaje al solicitado puede ser nulo si lo desea el colicitante
    Descripcion :str
    #estado de aprobacion porparte del supervisor para un control de estas solicitudes
    estado :str
#modelo que incluye el campo id para la creacion
class IntercambioHorarioCreate(IntercambioHorarioBase):
    id: int
    
#modelo para respuestas, con configuracion para usar orm
class IntercambioHorarioOut(IntercambioHorarioBase):
    id:int
    id_empleado: int

    
    class Config:
        orm_mode = True