# Frontend - Gestión Integral de Publicaciones

## Descripción
Este frontend permite la gestión del ciclo de vida de publicaciones académicas y editoriales, integrando roles de Autor, Revisor, Editor/Admin y Lector. Cada usuario accede a funcionalidades diferenciadas según su rol.

## Funcionalidades principales
- Registro e inicio de sesión con selección de rol
- Paneles diferenciados para cada rol
- CRUD de publicaciones (Autor)
- Revisión y recomendaciones (Revisor)
- Aprobación, rechazo y forzado de estado (Editor/Admin)
- Consulta de catálogo público (Lector)
- Notificaciones y feedback visual
- Seguridad con JWT y restricción de acceso

## Estructura del proyecto
- `src/views/` - Vistas principales por rol y utilidades
- `src/App.js` - Enrutamiento principal
- `src/index.js` - Punto de entrada

## Instalación y ejecución

1. Instala dependencias:
   ```sh
   npm install
   ```
2. Ejecuta la app:
   ```sh
   npm start
   ```

## Configuración
- Modifica las URLs de los endpoints en los archivos de vistas si tus microservicios están en otra dirección o puerto.

## Arquitectura
- Microservicios desacoplados (Spring Boot)
- API Gateway, Eureka, RabbitMQ, CockroachDB
- Seguridad OAuth2 + JWT
- Comunicación REST y eventos

## Roles y paneles
- **Autor:** CRUD de publicaciones propias
- **Revisor:** Comentar y recomendar publicaciones asignadas
- **Editor/Admin:** Aprobar, rechazar, forzar estado
- **Lector:** Consultar catálogo

## Ejemplo de uso
1. Regístrate y selecciona un rol
2. Inicia sesión
3. Accede al panel correspondiente
4. Realiza las acciones según tu rol

## Prueba de conexión (test rápido)

Puedes probar la conexión entre el frontend y el backend con el siguiente método:

1. Asegúrate de que el backend (por ejemplo, ms-auth) esté corriendo en el puerto correcto (por defecto, http://localhost:12480).
2. Abre una terminal y ejecuta:
   - Para verificar el estado del backend:
     ```sh
     curl http://localhost:12480/actuator/health
     ```
   - Para probar el endpoint de registro (en Linux/Mac o Git Bash):
     ```sh
     curl -X POST http://localhost:12480/auth/register -H "Content-Type: application/json" -d '{"nombres":"Test","apellidos":"User","email":"test@correo.com","password":"123456","rol":"ADMIN"}'
     ```
   - En PowerShell (Windows):
     ```powershell
     Invoke-RestMethod -Uri "http://localhost:12480/auth/register" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{"nombres":"Test","apellidos":"User","email":"test@correo.com","password":"123456","rol":"ADMIN"}'
     ```
3. Si recibes una respuesta válida, la conexión está bien. Si recibes un error 401 (No autorizado), revisa la configuración de seguridad del backend para permitir el acceso público a /auth/register.

Si usas Postman, puedes hacer la misma prueba enviando una petición POST al endpoint de registro.

## Contacto
Para dudas técnicas, contactar al equipo de desarrollo.
