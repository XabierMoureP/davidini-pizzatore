# Configuración de Infraestructura para la Aplicación de la Pizzería

## 1. Crear una VPC Dedicada

- Configuramos una VPC exclusiva para alojar la aplicación:
  - Utilizamos **2 AZs** (zonas de disponibilidad) con:
    - Dos subredes públicas
    - Dos subredes privadas
  - **NAT Gateway y Gateway de S3**: no habilitados
  - Mantener opciones de **DNS** como predeterminadas

## 2. Crear una Instancia de RDS

### 2.1 Configuración de Red

- Creamos un grupo de subredes para RDS:
  - Elegimos las zonas de disponibilidad que contienen las subredes privadas
  - Seleccionamos las subredes privadas

### 2.2 Crear la Base de Datos en RDS

- **Modo de Creación**: estándar
- **Motor**: MariaDB (última versión disponible)
- **Plantilla**: capa gratuita
- **Credenciales**: opción autoadministrada
- **Clase de Instancia**: `db.t3.micro`
- **Almacenamiento**: 20GB SSD (gp2)
- **Escalado Automático**: deshabilitado
- **Conexión a la VPC**:
  - Asociamos RDS a la VPC dedicada y elegimos el grupo de subredes creado anteriormente
  - **Acceso público**:
    - Deshabilitado (si vamos a conectarnos desde una instancia EC2)
    - Habilitado (si vamos a conectar desde un cliente externo, como DBeaver)
- Creamos un **grupo de seguridad** en la zona de disponibilidad preferida
- El resto de opciones se mantienen por defecto

## 3. Configuración de Acceso vía EC2 (si el Acceso Público de RDS está Deshabilitado)

- Creamos una instancia de **EC2**:

  - **Imagen**: seleccionar cualquiera de la capa gratuita
  - **Tipo de Instancia**: `t2.micro`
  - Generamos un **par de claves** específico para esta instancia
  - **Red**:
    - Seleccionamos la VPC dedicada y una subred pública
    - Habilitamos la asignación de IP
    - Creamos un **grupo de seguridad** que permita tráfico en los puertos **22** y **3306** (hacia RDS)
  - **Almacenamiento**: 8GB SSD (gp2)

- Modificamos el grupo de seguridad de RDS para permitir tráfico en el puerto **3306** desde nuestra EC2
- Conectamos a la instancia y ejecutamos:
  - Instalación de `mariadb-server` en Amazon Linux 2:
    ```bash
    yum install -y mariadb105-server
    ```
  - Conexión a la instancia RDS:
    ```bash
    mysql -h <RDS endpoint> -P 3306 -u <adminuser> -p
    ```

## 4. Creación de Tablas de la Pizzería

- Ejecutamos las consultas en `Transactions.sql` para crear las tablas necesarias en la base de datos.

## 5. Despliegue de una Lambda para Registro e Inicio de Sesión

- **Configuración de Lambda**:
  - Creamos una plantilla de Lambda desde cero
  - **Runtime**: Python
  - Mantenemos permisos predeterminados
  - Habilitamos URL de la función **sin autorización** para acceso desde el frontend
  - **Conexión a la VPC**:
    - Asociamos Lambda a la VPC dedicada
    - Seleccionamos las dos subredes públicas
    - Creamos un **grupo de seguridad**:
      - Permitir tráfico en el puerto **80** (para todas las IPs)
      - Permitir tráfico en el puerto **3306** (solo hacia RDS)
    - Asociamos este grupo de seguridad
  - Modificamos el grupo de seguridad de RDS para aceptar conexiones desde el grupo de seguridad de Lambda
  - Habilitamos **CORS** para la URL de la función:
    - En la configuración de la URL de la función, seleccionamos **Editar**
    - En Configuración Adicional, marcamos **Configurar CORS**

## 6. Modificación del Código de la Lambda

- Editamos el archivo `Lambdas/user-management/lambda_function.py`:
  - Adaptamos el código según nuestros requisitos
  - Zipeamos el archivo Python junto con sus dependencias y cargamos el archivo en Lambda
- Opcional: creamos un evento de prueba para verificar la conexión con la base de datos:
  - Cambiamos temporalmente `body = json.loads(event['body'])` por `body = event['body']`
  - Revertimos el cambio una vez completadas las pruebas

## 7. Configuración de la Página de Registro

- Modificamos el código del script de registro para adaptarlo a nuestro entorno.
- Abrimos el archivo `register.html` en un navegador para registrar un nuevo usuario.

## 8. Prueba de Inicio de Sesión

- Iniciamos sesión con el usuario recién creado para confirmar el acceso exitoso a la aplicación.
