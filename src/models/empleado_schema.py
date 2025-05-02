#importamos la clase base de pydantic
#permite crear modelos poo orientados a base de datos
from pydantic import BaseModel

#modelo base para reutilizacion (sin campo codigo)
class EmpleadoBase(BaseModel):
    
    Id_empleado: str 
    #imagen_perfil: str
    nombre: str
    apellido: str
    fecha_nacimiento: str
    correo: str
    contrasena: str
    telefono: str
    contacto_emergencia : str
    telefono_emergencia : str
    #habilidades: str #DESCOMENTAR PARA añadir validacion nula la base de datos o usar la variable y veriguar como insertar el dato
    fecha_contratacion: str
    area :str
    descripcion_funciones:str
    salario: int
    posicion: str #opciones en el estado laburando || esperando ingreso || descansando
    estado: str  # por defecto el empleado esta activo (true)
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

