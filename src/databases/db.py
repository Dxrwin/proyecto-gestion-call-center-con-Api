from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import psycopg2
from dotenv import load_dotenv

#cargamos las variables de entorno desde el archivo .env
load_dotenv()

#obtener la URL de la base de datos desde las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")




# Cargar la URL de la base de datos desde el archivo .env
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
DB_NAME = "dbcallcenter"  # Nombre de la base de datos que deseas crear

# Extraer los datos de conexión sin la base de datos
def get_connection_params():
    # Extraer la URL sin el nombre de la base de datos
    url_parts = DATABASE_URL.rsplit("/", 1)
    base_url = url_parts[0]  # URL sin la base de datos
    return base_url, DB_NAME

# Crear la base de datos si no existe
def create_database_if_not_exists():
    base_url, db_name = get_connection_params()
    try:
        # Conectar al servidor PostgreSQL sin especificar la base de datos
        conn = psycopg2.connect(base_url)
        conn.autocommit = True
        cursor = conn.cursor()

        # Verificar si la base de datos ya existe
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
        print(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
        # Fetchone devuelve una fila si existe, de lo contrario None
        exists = cursor.fetchone()

        if not exists:
            # Crear la base de datos si no existe
            cursor.execute(f"CREATE DATABASE {db_name}")
            print(f"Base de datos '{db_name}' creada exitosamente.")
        else:
            print(f"La base de datos '{db_name}' ya existe.")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error al verificar/crear la base de datos: {e}")

# Llamar a la función para crear la base de datos si no existe
create_database_if_not_exists()


# Crear el motor de la base de datos
engine = create_engine(DATABASE_URL)

#creamps una clase para manejar sesiones de la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#creamos la abse para los modelos ORM
#el orm es un mapeador objeto-relacional que permite interactuar con la base de datos utilizando objetos de Python en lugar de escribir consultas SQL directamente.
Base = declarative_base()