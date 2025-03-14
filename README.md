<h1 align="start"> API REST </h1>

<p> Este proyecto esta desarrollado para consumir una API REST que usa como servidor MongoDB y Expres(Nodejs) para la toma y almacenamiento de datos,
y usa la parte del cliente con Vite y react.

tambien te debo decir que encontraras un CRUD en este proyecto
toda funcion esta desarrollada e implementada para crear, actualizar, eliminar y almacenar un usuario
a traves de redes sociales o simplemente rellenando el formulario de registro
sientete libre de utilizar este codigo con motivos de investigacion,educativos o pasantias

</p>

Necesitaras las siguientes dependencias:

```bash
  BACKEND

      npm install bcryptjs cookie-parser dotenv express jsonwebtoken mongoose nodemon

  FRONTEND

      npm install firebase react-redux  react-router-dom react-toastify redux-persist  @reduxjs/toolkit
  

```

para el diseño te dejo libre eleccion este proyecto usa Tailwind y Fontawesome


tambien en la parte de cliente creamos un proxy para una mejor manipulacion de las llamadas con el servidor

```bash
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
});

```
