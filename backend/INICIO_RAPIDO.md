# 🚀 Guía de Inicio Rápido - Backend CEL

## Instalación y Configuración

### 1. Crear y activar entorno virtual

```powershell
# Navegar al directorio backend
cd backend

# Crear entorno virtual
python -m venv .venv

# Activar (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Activar (Windows CMD)
.\.venv\Scripts\activate.bat

# Activar (Linux/Mac)
source .venv/bin/activate
```

### 2. Instalar dependencias

```powershell
pip install -r requirements.txt
```

### 3. Probar la implementación CEL

```powershell
python test_cel.py
```

Deberías ver:
```
🚀 Iniciando pruebas CEL...
...
Pasados: 7 ✓
Fallidos: 5 ✗
Tasa de éxito: 58.3%
✅ Pruebas completadas
```

### 4. Iniciar el servidor

```powershell
uvicorn main:app --reload
```

El servidor estará disponible en:
- API: http://localhost:8000
- Docs interactiva: http://localhost:8000/docs

## Probar API con cURL

### Validar expresión

```powershell
curl -X POST "http://localhost:8000/api/validate" `
  -H "Content-Type: application/json" `
  -d '{
    "language": "CEL",
    "expression": "price > 100",
    "data": {
      "price": 150
    }
  }'
```

### Evaluar expresión

```powershell
curl -X POST "http://localhost:8000/api/evaluate" `
  -H "Content-Type: application/json" `
  -d '{
    "language": "CEL",
    "expression": "price * quantity",
    "data": {
      "price": 25.50,
      "quantity": 3
    }
  }'
```

## Ejemplos de Expresiones que Funcionan

### Operaciones Aritméticas
```json
{
  "expression": "price * quantity - discount",
  "data": {
    "price": 10.50,
    "quantity": 5,
    "discount": 5.00
  }
}
```

### Comparaciones
```json
{
  "expression": "age >= 18 && status == 'active'",
  "data": {
    "age": 25,
    "status": "active"
  }
}
```

### Fechas
```json
{
  "expression": "timestamp(expiry_date) > timestamp(today)",
  "data": {
    "expiry_date": "2026-12-31T00:00:00Z",
    "today": "2026-02-26T00:00:00Z"
  }
}
```

### Regex
```json
{
  "expression": "email.matches(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$')",
  "data": {
    "email": "usuario@example.com"
  }
}
```

### Operador Ternario
```json
{
  "expression": "score >= 70 ? 'Aprobado' : 'Reprobado'",
  "data": {
    "score": 85
  }
}
```

## Estructura del Proyecto

```
backend/
├── main.py                    # API FastAPI principal
├── requirements.txt           # Dependencias Python
├── test_cel.py               # Script de pruebas
├── challenges.json           # Desafíos en JSON
├── EJEMPLOS_CEL.md          # Documentación de ejemplos
├── NOTAS_IMPLEMENTACION.md  # Limitaciones y notas técnicas
├── INICIO_RAPIDO.md         # Esta guía
└── shared/
    ├── __init__.py
    ├── helper.py            # Funciones auxiliares
    └── cel_engine.py        # Motor CEL
```

## Solución de Problemas Comunes

### Error: "dict does not support field selection"

**Problema:** Intentas acceder a objetos anidados con dot notation.

**Solución:** Pasa las variables en el nivel raíz del objeto `data`:

❌ **No funciona:**
```json
{
  "expression": "user.age",
  "data": {
    "user": {
      "age": 25
    }
  }
}
```

✅ **Funciona:**
```json
{
  "expression": "age",
  "data": {
    "age": 25
  }
}
```

### Error 422: Unprocessable Content

**Problema:** El JSON enviado no coincide con el esquema esperado.

**Solución:** Asegúrate de incluir los 3 campos requeridos:
```json
{
  "language": "CEL",
  "expression": "...",
  "data": { ... }
}
```

### Error: undeclared reference

**Problema:** La variable no está en el contexto `data`.

**Solución:** Verifica que todas las variables de la expresión existen en `data`:

```json
{
  "expression": "price * quantity",
  "data": {
    "price": 10,
    "quantity": 5
  }
}
```

## Documentación Adicional

- [EJEMPLOS_CEL.md](EJEMPLOS_CEL.md) - Ejemplos detallados de expresiones
- [NOTAS_IMPLEMENTACION.md](NOTAS_IMPLEMENTACION.md) - Limitaciones técnicas
- [challenges.json](challenges.json) - Desafíos para el playground
- [README.md](README.md) - Documentación completa del backend

## Siguiente Paso: Integrar con Frontend

Una vez que el backend esté funcionando, el siguiente paso es:

1. Iniciar el frontend React (ver `/frontend/frontend_app/README.md`)
2. El frontend enviará requests a `http://localhost:8000/api/validate` y `/api/evaluate`
3. El formato de request ya está compatible con lo que espera el backend

¡Listo para desarrollar! 🎉
