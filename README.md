# DropMix - Plataforma de Mashups para DJs y Productores

**DropMix** es una plataforma donde DJs y productores pueden compartir, intercambiar y descargar mashups de música. La idea principal es que los usuarios aporten mashups para poder descargar otros, creando una biblioteca de contenido colaborativo. Además, la plataforma contará con funciones de moderación para asegurar que los mashups subidos cumplan con ciertos estándares.

## Funcionalidades

### Para usuarios:
- **Subir Mashups**: Los usuarios pueden subir mashups a la plataforma. Cada mashup pasará por un proceso de moderación antes de ser agregado a la biblioteca.
- **Descargar Mashups**: Para descargar mashups, los usuarios deben aportar mashups a la plataforma, funcionando como un intercambio de contenido.
- **Estado de los Mashups**: Los usuarios pueden ver el estado de sus mashups: si están enviados, aprobados o rechazados.
- **Intercambio de Mashups**: Los usuarios pueden descargar tantos mashups como hayan subido al sitio.

### Para moderadores:
- **Revisión de Mashups**: Los moderadores tienen la capacidad de revisar los mashups subidos por los usuarios, aprobándolos o rechazándolos.
- **Gestión de Contenido**: Los moderadores pueden gestionar el contenido de la plataforma, asegurándose de que cumpla con las normas de calidad.

### Funcionalidades adicionales:
- **Administración de Usuarios**: Los administradores pueden gestionar usuarios, ver estadísticas de actividad y controlar el contenido en la plataforma.
- **Estadísticas**: Los administradores pueden acceder a estadísticas sobre los mashups subidos, los más descargados, entre otros.

## Tecnologías Utilizadas

- **Frontend**: React
- **Backend**: Laravel
- **Base de Datos**: MySQL (u otra según preferencia)
- **Autenticación**: Laravel Sanctum o JWT (según se decida)
  
## Instalación

### Requisitos previos:
Asegúrate de tener instalados los siguientes componentes:

- [PHP](https://www.php.net/downloads.php) (versiones 8.0 o superior recomendadas)
- [Composer](https://getcomposer.org/download/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm) o [yarn](https://classic.yarnpkg.com/en/docs/install)
- [MySQL](https://dev.mysql.com/downloads/installer/)

### Pasos para iniciar el proyecto:

1. Clona este repositorio en tu máquina local e inicia el proyecto:
   ```bash
   git clone https://github.com/tu_usuario/dropmix.git
   cd dropmix
   composer run dev
    ```
   
