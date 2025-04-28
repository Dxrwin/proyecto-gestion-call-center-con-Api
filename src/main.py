from fastapi import FastAPI
from src.Api import empleado_routes
from src.databases.db import Base, engine
#from fastapi.middleware.cors import CORSMiddleware

#creamos todas las tablas de la base de datos si no existen
Base.metadata.create_all(bind=engine)

#creamos la instancia principal de la aplicacion
app = FastAPI()

#incluimos el middleware de CORS para permitir peticiones desde el frontend
#app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"],)

#incluimos las rutas de la api
app.include_router(empleado_routes.router)