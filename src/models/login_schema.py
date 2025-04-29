#importamos la clase base de pydantic
from pydantic import BaseModel
from typing import Optional

#modelo base para reutilizacion (sin campo codigo)
class LoginBase(BaseModel):
    correo: str
    contrasena: str
    
#modelo para crear un empleado (con campo codigo)
class LoginCreate(LoginBase):
    id: int  # id unico del empleado (codigo)
    
    
#modelo para respuestas, con configuracion para usar orm
class LoginOut(LoginBase):
    id: int
    id_empleado: Optional[int] = None
    id_administrador: Optional[int] = None
    correo: str
    contrasena: str
    rol: str
    
    class Config: 
        orm_mode = True #para que fastapi pueda acepte objetos orm