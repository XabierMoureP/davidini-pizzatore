import json
import mysql.connector

def lambda_handler(event, context):
    # Cargar el cuerpo de la solicitud
    body = json.loads(event['body'])
    # body = event['body']
    # Conectar a la base de datos
    mydb = mysql.connector.connect(
        host="davidini-pizzatore.c1a4mekoqchm.eu-west-3.rds.amazonaws.com",
        user="admin",
        password="adminadmin",
        database="db_pizzeria"
    )

    # Obtener el cursor para ejecutar consultas
    cursor = mydb.cursor()

    # Manejar las operaciones basadas en la entrada del evento
    if body.get('operation') == 'register':
        response = insert_user(mydb, cursor, body.get('email'), body.get('nombre'), body.get('apellido'), body.get('contrasena'))
        return response
    elif body.get('operation') == 'login':
        response = login_user(cursor, body.get('email'), body.get('contrasena'))
        return response
    else:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': json.dumps("Invalid operation")
        }

def insert_user(mydb, cursor, email, nombre, apellido, contrasena):
    insert_query = "INSERT INTO Usuarios(email, nombre, apellido, contrasena) VALUES (%s, %s, %s, %s)"
    cursor.execute(insert_query, (email, nombre, apellido, contrasena))
    mydb.commit()
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
        },
        'body': json.dumps("User inserted")
    }

def login_user(cursor, email, contrasena):
    # Consultar el usuario en la base de datos
    cursor.execute("SELECT contrasena FROM Usuarios WHERE email = %s", (email,))
    result = cursor.fetchone()
    
    if result:
        # Comparar la contraseña ingresada con la almacenada
        stored_contrasena = result[0]
        if contrasena == stored_contrasena:
            response_body = {
                "message": "Login successful",
                "email": email
            }
            status_code = 200
        else:
            response_body = {
                "message": "Invalid password"
            }
            status_code = 401
    else:
        response_body = {
            "message": "User not found"
        }
        status_code = 404
    
    # Retornar la respuesta con el header Content-Type para JSON
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
        },
        'body': json.dumps(response_body)
    }
