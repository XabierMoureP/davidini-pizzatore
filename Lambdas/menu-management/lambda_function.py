import json
import mysql.connector
from mysql.connector import Error
from decimal import Decimal

def lambda_handler(event, context):
    try:
        # Conectar a la base de datos RDS usando mysql.connector
        mydb = mysql.connector.connect(
            host="davidini-pizzatore.c1a4mekoqchm.eu-west-3.rds.amazonaws.com",
            user="admin",
            password="adminadmin",
            database="db_pizzeria"
        )
                
        cursor = mydb.cursor(dictionary=True)
        
        # Consulta para obtener los productos del menú
        cursor.execute("SELECT * FROM Productos;")
        productos = cursor.fetchall()
        cursor.close()
        
        # Formatear la respuesta JSON
        response = {
            "menu": productos
        }

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': json.dumps(response, default=decimal_default)
        }
    
    except Error as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error al conectar a la base de datos: {str(e)}")
        }

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError