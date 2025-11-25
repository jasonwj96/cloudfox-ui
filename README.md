Para iniciar la aplicacion se debe:

- Añadir .env en la carpeta raiz del proyecto. Utilizar como ejemplo el archivo .env_sample
- Crear una base de datos MongoDB llamada "cloudfox" y dentro de ella crear las colecciones: "users"
y "models". 
- Ejecutar "pnpm install" para instalar las dependencias del frontend y backend.
- Dentro de la carpeta "model-server" ejecutar pip install -r requirements.txt para instalar las 
  dependendias de FastAPI.
- En package.json se crearon comandos pnpm run para iniciar el frontend y los 2 APIS.

Uso de la aplicacion:
- Registrarse e iniciar sesión en la aplicación.
- Se añadió un modelo XGBoost en la carpeta cloudfox-app/models para pruebas.
- En la carpeta "cloudfox proof of concept" se creo una pagina web para validar 
  la ejecución del modelo.