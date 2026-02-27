# Backend API - Evaluador de Expresiones CEL

Backend FastAPI que valida y evalúa expresiones CEL (Common Expression Language) enviadas desde el frontend.

## Características

- ✅ Evaluación de expresiones CEL
- ✅ Validación de sintaxis CEL
- ✅ API REST con FastAPI
- ✅ Soporte CORS para frontend
- ✅ Manejo de errores robusto
- 🔄 Starlark (próximamente)

## Requisitos

- Python 3.13.12

## Instalación

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # En Windows
# source venv/bin/activate  # En Linux/Mac
pip install -r requirements.txt
```

## Ejecutar

```bash
uvicorn main:app --reload
```

Disponible en:
- API: http://localhost:8000
- Documentación: http://localhost:8000/docs

## Estructura del Proyecto

```
backend/
├── main.py                 # API FastAPI principal
├── requirements.txt        # Dependencias Python
├── test_cel.py            # Script de pruebas CEL
├── challenges.json        # Desafíos en formato JSON
├── EJEMPLOS_CEL.md       # Documentación de ejemplos
└── shared/
    ├── helper.py          # Funciones auxiliares
    └── cel_engine.py      # Motor de evaluación CEL
```

## Endpoints API

### POST /api/validate

Valida la sintaxis de una expresión CEL.

**Request:**
```json
{
  "language": "CEL",
  "expression": "data.user.name",
  "data": {
    "user": {
      "name": "Juan"
    }
  }
}
```

**Response (éxito):**
```json
{
  "success": true,
  "message": "Expresión CEL válida",
  "expression": "data.user.name"
}
```

**Response (error):**
```json
{
  "success": false,
  "message": "Error de sintaxis en expresión CEL",
  "error": "...",
  "expression": "data.user.name"
}
```

### POST /api/evaluate

Evalúa una expresión CEL con el contexto proporcionado.

**Request:**
```json
{
  "language": "CEL",
  "expression": "data.a + data.b",
  "data": {
    "a": 5,
    "b": 3
  }
}
```

**Response (éxito):**
```json
{
  "success": true,
  "result": 8,
  "expression": "data.a + data.b",
  "data": {
    "a": 5,
    "b": 3
  }
}
```

**Response (error):**
```json
{
  "success": false,
  "message": "Error al evaluar expresión CEL",
  "error": "...",
  "expression": "data.a + data.b"
}
```

## Probar CEL

Para probar la implementación CEL con los desafíos incluidos:

```bash
python test_cel.py
```

Este script ejecutará todos los desafíos definidos en `challenges.json` y mostrará los resultados.

## Ejemplos de Expresiones CEL

Ver [EJEMPLOS_CEL.md](EJEMPLOS_CEL.md) para una guía completa de ejemplos.

**Acceso a propiedades:**
```cel
data.user.name
```

**Comparaciones:**
```cel
data.price > 100
```

**Operadores lógicos:**
```cel
data.active && data.verified
```

**Funciones:**
```cel
size(data.items) > 0
```

**Filtros:**
```cel
data.numbers.filter(n, n > 5)
```

## Dependencias

- **fastapi**: Framework web para APIs
- **uvicorn**: Servidor ASGI
- **pydantic**: Validación de datos
- **celpy**: Implementación de CEL para Python

## Desarrollo

### Agregar nuevos desafíos

Edita `challenges.json` y agrega nuevos objetos con la estructura:

```json
{
  "id": 13,
  "title": "Título del desafío",
  "description": "Descripción",
  "difficulty": "easy|medium|hard",
  "json_input": { ... },
  "cel_expression": "...",
  "expected_result": ...
}
```

### Implementar Starlark

El código está preparado para agregar soporte de Starlark. Implementar en `shared/starlark_engine.py` siguiendo el patrón de `cel_engine.py`.

## Notas sobre CEL

CEL (Common Expression Language) es un lenguaje de expresiones no-Turing completo, diseñado para ser:

- **Seguro**: Sin efectos secundarios, sin bucles infinitos
- **Rápido**: Evaluación eficiente
- **Portable**: Implementaciones en múltiples lenguajes
- **Simple**: Sintaxis familiar basada en C

Más información: https://github.com/google/cel-spec
