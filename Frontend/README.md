# Biblioteca Virtual

Este proyecto es una biblioteca virtual diseñada para almacenar y gestionar tesis en formato PDF. La aplicación permite a los usuarios visitantes ver y descargar tesis, mientras que los administradores pueden agregar, modificar y eliminar tesis. Además, incluye funcionalidades de búsqueda y filtrado para facilitar la navegación por el contenido.

## Estructura del Proyecto

El proyecto tiene la siguiente estructura de archivos:

```
biblioteca-virtual
├── src
│   ├── index.html          # Estructura principal de la aplicación
│   ├── styles
│   │   └── styles.css      # Estilos de la aplicación
│   ├── scripts
│   │   └── app.js          # Lógica de la aplicación
│   ├── assets
│   │   └── tesis
│   │       └── example.pdf # Ejemplo de tesis en formato PDF
├── README.md               # Documentación del proyecto
└── package.json            # Configuración para npm
```

## Funcionalidades

- **Visibilidad de Tesis**: Los usuarios pueden ver y descargar tesis en formato PDF.
- **Gestión de Tesis**: Los administradores pueden agregar, modificar y eliminar tesis.
- **Barra de Búsqueda**: Permite a los usuarios buscar tesis por título, autor, etc.
- **Filtros**: Los usuarios pueden filtrar las tesis por:
  - Carrera
  - Alfabético
  - Fecha de publicación
  - Autor

## Instalación

1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Navega al directorio del proyecto:
   ```
   cd biblioteca-virtual
   ```
3. Instala las dependencias:
   ```
   npm install
   ```

## Uso

Para ejecutar la aplicación, abre el archivo `src/index.html` en un navegador web. Asegúrate de tener un servidor local si deseas probar las funcionalidades que requieren manejo de sesiones.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.