#importamos la clase base de pydantic
from pydantic import BaseModel

class AdministradorBase(BaseModel):
    #modelo base para reutilizacion (sin campo codigo)
    Id_administrador: str 
    imagen_perfil: str
    nombre: str
    apellido: str
    correo: str
    contrasena: str
    telefono: str
    rol: str  # por defecto el empleado es un empleado normal (no admin)
    
    
#modelo para crear un empleado (con campo codigo)
class AdministradorCreate(AdministradorBase):
    id: int  # id unico del empleado (codigo)
    #area_trabajo: int  # id del area de trabajo donde trabaja el empleado (llave foranea)
    
#modelo para respuestas, con configuracion para usar orm
class AdministradorOut(AdministradorBase):
    id:int
    
    class Config:
        orm_mode = True #para que fastapi pueda acepte objetos orm