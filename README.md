# Risk Zero

Esta es una API REST desarrollada en .NET 9 como solución a una prueba técnica para un puesto de .NET Developer. El servicio busca de forma concurrente entidades en múltiples listas de alto riesgo y consolida los resultados en una única respuesta.

Esta es una aplicación web SPA (Single Page Application) integral, como solución a una prueba técnica para un puesto de Full Stack Web Developer, diseñada para facilitar el proceso de debida diligencia de proveedores. La solución permite a los usuarios gestionar un inventario detallado de proveedores y, crucialmente, realizar un cruce automático (screening) con [High Risk Entity Searcher API](https://github.com/Lenas25/HighRiskEntitySearcher).

## Tecnologías Usadas

### Frontend
* **Lenguaje/Framework:** React
* **Build Tool:** Vite
* **UI Frameworks:** Material UI (MUI), Tailwind CSS
* **Gestión de Formularios:** React Hook Form

### Backend Principal (Gestión de Proveedores y Autenticación)
* **Lenguaje/Framework:** .NET Core
* **Base de datos:** SQL Server
* **Servidor:** Kestrel (integrado en .NET Core)
* **Autenticación:** JWT (JSON Web Tokens)

---

## Estructura del Proyecto

El proyecto está organizado en los siguientes directorios principales:

* `/RiskZeroUI`: Contiene el código fuente de la aplicación React con Vite.
* `/RiskZero`: Contiene el código fuente del backend principal (.NET Core para proveedores y autenticación).
* `/database`: Directorio que contiene los scripts SQL para la creación y carga inicial de la base de datos.

---

## Características

-   **Autenticación y Autorización:** Tanto las rutas del frontend como del backend se encuentran protegidas mediante JWT. Es necesario registrarse e iniciar sesión usando `/api/auth/register` y `/api/auth/login`
-   **Arquitectura Limpia:** Sigue principios de diseño SOLID, utilizando una arquitectura en capas (Controladores, Servicios, Modelos) con Inyección de Dependencias en .NET Core.
-   **Gestión de Proveedores:** Sistema completo de CRUD para la administración de proveedores con validación de datos y manejo de errores.
-   **Screening de Riesgo:** Integración con APIs externas para realizar verificaciones de proveedores contra listas de alto riesgo (OFAC, World Bank, Offshore Leaks).
-   **Interfaz Moderna:** Frontend desarrollado en React con Material-UI y Tailwind CSS, proporcionando una experiencia de usuario intuitiva y responsive.
-   **Base de Datos Robusta:** Utiliza Entity Framework Core con SQL Server para el manejo eficiente de datos y migraciones.

---

## Cómo Ejecutar el Proyecto

### Prerrequisitos

- **Node.js (LTS recomendado) y npm/yarn:** Para el frontend.
- **SDK de .NET Core (versión 6.0 o superior):** Para el backend principal.
- **Deploy de API EXTERNA:** Mantener la High Risk Entity Searcher API ejecutandose.
- **SQL Server:** Una instancia de SQL Server (local o remota) corriendo con el script de la base de datos ejecutada.
- **Git:** Para clonar el repositorio.
- Un editor de código como VS Code o Zed.

### Configuración de la Base de Datos

### Pasos para la Ejecución

1.  **Clonar el Repositorio**
    ```bash
    git clone https://github.com/Lenas25/RiskZero.git 
    cd RiskZero
    ```

#### Desde Backend  `cd /RiskZero`

2.  **Restaurar Dependencias de .NET**
    Este comando descarga todos los paquetes NuGet necesarios para la API y las pruebas.
    ```bash
    dotnet restore
    ```

3.  **Configura `appsettings.json`:**
    Si la API se usará desde otra aplicación (como un frontend en un dominio diferente), es crucial habilitar los CORS (Cross-Origin Resource Sharing).Para configurarlo, simplemente modifica la sección "CorsSettings" en tu archivo de configuración (normalmente appsettings.json). En la lista "AllowedOrigins", agrega las URLs de los dominios desde los cuales se conectarán a tu API.
    ```json
    {
        ...
        "CorsSettings": {
            "AllowedOrigins": [
                "http://localhost:XXXX",
            ]
        }
    }
    ```

5.  **Ejecutar la API**
    Una vez que las dependencias están listas, lanza el servidor IIL Express de la API desde el terminal o el editor de código por ejemplo en Visual Studio hay una opción de ejecuta en la parte superior central.
    ```bash
    dotnet publish -c Release -o .\publish
    "C:\Program Files\IIS Express\iisexpress.exe" /path:"C:\Ruta\Completa\A\Tu\Proyecto\RiskZero\publish" /port:XXXX
    ```
    La terminal mostrará las URLs en las que está escuchando la API, usualmente `https://localhost:XXXX`.

### Configuración del Frontend (`cd /RiskZeroUI`)

6.  **Instala las dependencias de Node.js:**
    ```bash
    npm install
    # o
    yarn install
    ```

7.  **Configura las URLs de las APIs:**
    Crea un archivo `.env.local` en la raíz del directorio `RiskZeroUI` y añade las URLs de tus backends:

    ```env
    VITE_API_BASE_URL=https://localhost:XXXX/api # URL del backend principal (proveedores, autenticación)
    VITE_API_EXTERNAL_URL=http://localhost:XXXX/api # URL de la API de screening de alto riesgo
    ```
    * Asegúrate de que los puertos y protocolos (`http` o `https`) coincidan con los que tus APIs están escuchando.

8.  **Iniciar el Frontend:**
    Abre una **tercera** terminal, navega a la carpeta `/frontend` y ejecuta:
    ```bash
    npm run dev
    # o
    yarn dev
    ```
    El frontend se iniciará, generalmente en `http://localhost:5173`. Abre esta URL en tu navegador.

9.  **Iniciar el Flujo de la aplicación:**
    Asegurate de registrar el usuario, posteriormente iniciar sesión para ingresar a la ruta principal, ya que tanto el front como el back cuantan con autenticación y autorización, luego podrás disfrutar de la funcionalidades de Agregar, Editar y Eliminar Proveedor, además se podrá visualizar a detalle un cruce con la listas de alto riesgos de una api propia creada pero externa del proyecto.

---

## Entregables

-   **Código Fuente:** Disponible en este repositorio.
-   **Scripts de creación y carga inicial:** Disponible en la carpeta `/database`.
-   **Colección de Postman:** Es posible visualizar la colección de la REST API de RiskZero para manejar las consultas hacia la base de datos https://documenter.getpostman.com/view/35040380/2sB34ZqPhi

---

## Capturas de Aplicativo Funcional
![image](https://github.com/user-attachments/assets/8646643f-cb27-4dbf-85c4-7de86ebda8d9)
![image](https://github.com/user-attachments/assets/084faab9-2dd6-4c3e-be8e-298816d5df84)
![image](https://github.com/user-attachments/assets/5a94336f-92bb-413d-9687-d0d1bdec3d95)
![image](https://github.com/user-attachments/assets/f48b2837-6c5b-4091-8393-679bc0e94197)
![image](https://github.com/user-attachments/assets/831073be-cf55-4ab2-b591-5de3a813f485)




