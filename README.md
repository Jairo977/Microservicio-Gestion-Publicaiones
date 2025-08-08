# Arquitectura de Microservicios para la Gestión Integral de Publicaciones

## Universidad de las Fuerzas Armadas ESPE
**Departamento de Ciencias de la Computación**  
**Ingeniería en Tecnologías de la Información**  
**Docente:** Geovanny Cudco

---

## Descripción General
Este proyecto implementa una plataforma distribuida para la gestión completa del ciclo de vida de publicaciones académicas y editoriales (artículos y libros) elaboradas por autores registrados. La solución está basada en una arquitectura de microservicios desacoplados, con descubrimiento dinámico de servicios, API Gateway, comunicación síncrona y asíncrona, base de datos distribuida y un microservicio de notificaciones.

## Objetivo
Permitir el registro y autenticación segura de usuarios (autores, revisores, administradores, lectores), creación y edición de publicaciones, flujo de revisión colaborativa, control de cambios, aprobación editorial y publicación final en un Catálogo accesible externamente.

---

# Créditos

- **Autor:** Jairo Wladimir Ruiz Saenz
- **Docente:** Geovanny Cudco

---

## Microservicios y Componentes

- **ms-auth**: Autenticación/autorización basada en OAuth2 + JWT, gestión de usuarios y roles.
- **ms-api-gateway**: Enrutamiento, validación JWT, CORS, logging, circuit breakers.
- **ms-eureka-server**: Descubrimiento dinámico de servicios.
- **api-publicaciones**: Gestión de autores y publicaciones, control de versiones y estados, eventos de dominio.
- **ms-notificaciones**: Consumo de eventos y envío de notificaciones multicanal (email, WebSocket).
- **ms-usuarios**: Gestión de usuarios y roles adicionales.
- **crocroach-db**: Base de datos distribuida CockroachDB multinodo.
- **frontend**: Aplicación React para la interacción de usuarios según roles.
- **models-bpmn**: Modelos BPMN del flujo de publicaciones.
- **kubernetes**: Archivos de despliegue para orquestación y alta disponibilidad.

---

## Arquitectura

- **Base de datos distribuida:** CockroachDB (alta disponibilidad, tolerancia a fallos, transacciones ACID).
- **Mensajería:** RabbitMQ para eventos de dominio y notificaciones.
- **API Gateway:** Unifica y protege el acceso a los microservicios.
- **Service Discovery:** Eureka para registro y localización dinámica de servicios.
- **Observabilidad:** Prometheus, Grafana, ELK, Jaeger (opcional).

---

## Funcionalidades Principales

- Registro y autenticación de usuarios (OAuth2 + JWT)
- Administración de autores y publicaciones
- Proceso de revisión editorial multi-etapa
- Control de versiones y estados de publicación
- Notificaciones multicanal
- Trazabilidad y auditoría
- Monitoreo y observabilidad

---

## Estructura del Proyecto

```
api-publicaciones/      # Microservicio de publicaciones
crocroach-db/           # Configuración de CockroachDB
frontend/               # Aplicación React
models-bpmn/            # Modelos BPMN
ms-api-gateway/         # API Gateway
ms-auth/                # Servicio de autenticación
ms-eureka-server/       # Eureka Service Discovery
ms-notificaciones/      # Servicio de notificaciones
ms-usuarios/            # Servicio de usuarios
kubernetes/             # Archivos de despliegue
```

---

## Despliegue Local (Docker Compose)

1. Clona el repositorio:
   ```sh
   git clone https://github.com/Jairo977/Microservicio-Gestion-Publicaiones.git
   cd Microservicio-Gestion-Publicaiones
   ```
2. Configura las variables de entorno necesarias en cada microservicio.
3. Levanta la base de datos y RabbitMQ:
   ```sh
   cd crocroach-db
   docker-compose up -d
   ```
4. Levanta los microservicios (ejemplo para Maven):
   ```sh
   cd ms-auth && ./mvnw spring-boot:run
   cd ms-api-gateway && ./mvnw spring-boot:run
   cd ms-eureka-server && ./mvnw spring-boot:run
   cd ms-notificaciones && ./mvnw spring-boot:run
   cd ms-usuarios && ./mvnw spring-boot:run
   cd api-publicaciones && ./mvnw spring-boot:run
   # Repite para cada microservicio necesario
   ```
5. Levanta el frontend:
   ```sh
   cd frontend
   npm install
   npm start
   ```

---

## Despliegue en la Nube

- Puedes usar Railway, Vercel, Fly.io, AccuWeb.Cloud, etc.
- Incluye los archivos de despliegue en la carpeta `kubernetes/` para orquestación.

---

## Modelos BPMN

Los modelos BPMN del flujo de publicaciones y reclamos se encuentran en la carpeta `models-bpmn/` y pueden ser editados con Camunda Modeler.

---

## Seguridad

- Autenticación y autorización con OAuth2 y JWT.
- Roles mínimos: AUTOR, REVISOR, EDITOR, ADMIN, LECTOR.
- Políticas de acceso según rol y estado de la publicación.

---

## Observabilidad y Monitoreo

- Exportación de métricas con Micrometer → Prometheus.
- Trazas distribuidas con OpenTelemetry + Jaeger.
- Logs estructurados (JSON) para ELK stack.

---

## Créditos

- **Autores:** Equipo de Arquitectura de Software, ESPE
- **Docente:** Geovanny Cudco

---

## Licencia

Este proyecto es solo para fines académicos.
