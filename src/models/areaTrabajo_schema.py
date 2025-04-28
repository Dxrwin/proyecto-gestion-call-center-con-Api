#importamos la calse base de pydantic
from pydantic import BaseModel

#modelo base para reutilizacion (sin campo codigo)
class AreaTrabajoBase(BaseModel):
    nombre: str
    descripcion: str
    ubicacion: str
    telefono: str
    correo: str
    estado: bool  # por defecto el area de trabajo esta activa (true)
    
#modelo para crear un area de trabajo (con campo codigo)
class AreaTrabajoCreate(AreaTrabajoBase):
    id: int  # id unico del area de trabajo (codigo)
    #id_empleado: int  # id del empleado que trabaja en el area de trabajo (llave foranea)
    
    
#modelo para respuestas, con configuracion para usar orm
class AreaTrabajoOut(AreaTrabajoBase):
    id:int
    
    class Config:
        orm_mode = True #para que fastapi pueda acepte objetos orm