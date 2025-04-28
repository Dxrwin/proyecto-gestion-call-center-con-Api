#importamos la clase base de pydantic
#permite crear modelos poo orientados a base de datos
from pydantic import BaseModel

#modelo base para reutilizacion (sin campo codigo)
class EmpleadoBase(BaseModel):
    
    Id_empleado: str 
    imagen_perfil: str
    nombre: str
    apellido: str
    fecha_nacimiento: str
    correo: str
    contrasena: str
    telefono: str
    habilidades: str
    fecha_contratacion: str
    salario: int
    posicion: str
    estado: bool  # por defecto el empleado esta activo (true)
    rol: str  # por defecto el empleado es un empleado normal (no admin)
    
#modelo para crear un empleado (con campo codigo)
class EmpleadoCreate(EmpleadoBase):
    id: int  # id unico del empleado (codigo)
    #area_trabajo: int  # id del area de trabajo donde trabaja el empleado (llave foranea)

#modelo para respuestas, con configuracion para usar orm
class EmpleadoOut(EmpleadoBase):
    id:int
    
    class Config:
        orm_mode = True #para que fastapi pueda acepte objetos orm

