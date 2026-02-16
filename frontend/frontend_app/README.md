# Playground de Evaluación de Expresiones

Este proyecto corresponde al desarrollo realizado durante la práctica profesional. La aplicación permite ingresar datos en formato JSON y evaluar expresiones sobre dichos datos mediante un backend conectado a la interfaz web.

## Avance actual del proyecto

Actualmente el sistema cuenta con una integración funcional entre frontend y backend.

### Frontend (React)

- Interfaz para ingresar datos JSON
- Campo para escribir expresiones a evaluar
- Selector de lenguaje (CEL / Starlark en desarrollo)
- Botones de Validación y Evaluación
- Visualización del resultado en pantalla
- Panel de desafíos (Challenges)

### Backend (FastAPI)

- API desarrollada en Python con FastAPI
- Endpoint POST /api/evaluate
- Recepción de lenguaje, expresión y datos JSON
- Respuesta con resultado procesado

### Conexión Frontend ↔ Backend

- Implementada mediante solicitudes HTTP (fetch)
- Probada con Postman
- Resultado mostrado dinámicamente en la interfaz

## Tecnologías utilizadas

- React
- JavaScript
- FastAPI
- Python
- Git y GitHub

## Cómo ejecutar el proyecto

### Ejecutar Backend

Abrir terminal en la carpeta backend:

python -m venv venv
venv\Scripts\activate
python -m uvicorn main:app --reload

Servidor disponible en:
http://localhost:8000

### Ejecutar Frontend

Abrir terminal en la carpeta del frontend:

npm install
npm start

Abrir en el navegador:
http://localhost:3000

## Ejemplo de prueba

JSON de entrada:

{
"data": {
"a": 1,
"b": 2,
"c": 3
}
}

Expresión:

a + b

## Próximos pasos

- Implementar validación real de expresiones
- Soporte completo para múltiples lenguajes
- Mejora de la interfaz
- Manejo de errores y validaciones
