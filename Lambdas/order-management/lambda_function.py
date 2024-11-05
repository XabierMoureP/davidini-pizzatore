import json
import mysql.connector

def lambda_handler(event, context):
    # Conectar a la base de datos
    mydb = mysql.connector.connect(
        host="davidini-pizzatore.c1a4mekoqchm.eu-west-3.rds.amazonaws.com",
        user="admin",
        password="adminadmin",
        database="db_pizzeria"
    )

    cursor = mydb.cursor()

    # Cargar el cuerpo de la solicitud
    try:
        body = json.loads(event['body'])
    except (json.JSONDecodeError, KeyError):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': json.dumps("Invalid input format")
        }

    id_usuario = body.get("id_usuario")
    cart_items = body.get("cartItems", [])

    # Verificar que id_usuario y cart_items no estén vacíos
    if not id_usuario or not cart_items:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': json.dumps("Missing id_usuario or cartItems")
        }

    try:
        # Iniciar la transacción
        mydb.start_transaction()

        # 1. Insertar el pedido en la tabla Pedidos
        cursor.execute("INSERT INTO Pedidos (id_usuario) VALUES (%s)", (id_usuario,))
        
        # Obtener el id_pedido recién insertado
        id_pedido = cursor.lastrowid

        # 2. Insertar cada producto en la tabla Pedido_Menu
        for item in cart_items:
            id_producto = item.get("id_producto")

            if id_producto:  # Verificar que el producto tenga id_producto
                cursor.execute(
                    "INSERT INTO Pedido_Menu (id_pedido, id_menu, id_producto) VALUES (%s, %s, %s)",
                    (id_pedido, None, id_producto)
                )

        # Confirmar (commit) los cambios de la transacción si todo fue exitoso
        mydb.commit()

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': json.dumps({
                "message": "Order processed successfully",
                "id_pedido": id_pedido
            })
        }

    except mysql.connector.Error as err:
        # Manejar errores de la base de datos y deshacer transacción
        mydb.rollback()  # Deshacer todos los cambios si ocurre un error
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': json.dumps({"error": str(err)})
        }

    finally:
        # Cerrar la conexión a la base de datos
        cursor.close()
        mydb.close()
