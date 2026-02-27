# 🚀 Guía de Inicio Rápido - CEL Playground

## Resumen de Funcionalidades

El CEL Playground ahora soporta **dos motores CEL diferentes**:

1. **CEL Common (Rust)** ⚡ - Implementación respaldada por Rust (recomendado)
   - Tasa de éxito: 66.7%
   - Mejor rendimiento
   - Mejor soporte para objetos JSON
   
2. **PyCEL (Python)** 🐍 - Implementación pura en Python
   - Tasa de éxito: 58.3%
   - Más fácil de debuggear
   - Mejor para operaciones aritméticas complejas

## 📋 Requisitos Previos

- **Python 3.13+** (con pip)
- **Node.js 24+** (con npm)

## 🔧 Instalación

### 1. Instalar dependencias del backend

```bash
cd backend
pip install -r requirements.txt
```

Esto instalará:
- FastAPI y Uvicorn
- cel-python (PyCEL)
- common-expression-language (CEL Common/Rust)

### 2. Instalar dependencias del frontend

```bash
cd frontend/frontend_app
npm install
```

## ▶️ Iniciar las Aplicaciones

### Terminal 1: Backend (Puerto 8000)

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

Deberías ver:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Terminal 2: Frontend (Puerto 3000)

```bash
cd frontend/frontend_app
npm start
```

El navegador se abrirá automáticamente en `http://localhost:3000`

## 🎮 Uso del Selector de Motor CEL

### En la Interfaz Web

1. Abre `http://localhost:3000` en tu navegador
2. En la sección de controles, verás un nuevo selector: **"CEL Engine:"**
3. Opciones disponibles:
   - **CEL Common (Rust) ⚡** (predeterminado)
   - **PyCEL (Python) 🐍**

### Ejemplo de Uso

**1. Ingresa tu JSON:**
```json
{
  "data": {
    "user": {
      "name": "Juan",
      "age": 30
    },
    "price": 150
  }
}
```

**2. Ingresa tu expresión CEL:**
```
user.age > 18
```

**3. Selecciona el motor:**
- Elige entre "CEL Common (Rust)" o "PyCEL (Python)"

**4. Click en "Evaluate"**

## 📊 Comparación de Motores

| Característica | CEL Common (Rust) | PyCEL (Python) |
|----------------|-------------------|----------------|
| **Tasa de éxito** | 66.7% (8/12) | 58.3% (7/12) |
| **Acceso a objetos** | ✅ Excelente | ⚠️ Limitado |
| **Operadores lógicos** | ✅ Completo | ⚠️ Con errores |
| **Aritmética compleja** | ⚠️ Limitada | ✅ Buena |
| **Rendimiento** | ⚡ Rápido (Rust) | 🐢 Más lento |
| **Debugging** | ⚠️ Difícil | ✅ Fácil |

### Casos de Uso Recomendados

**Usa CEL Common (Rust)** para:
- ✅ Trabajar con objetos JSON complejos
- ✅ Aplicaciones en producción
- ✅ Condiciones lógicas múltiples (`&&`, `||`)
- ✅ Máximo rendimiento

**Usa PyCEL (Python)** para:
- ✅ Debugging y desarrollo
- ✅ Operaciones aritméticas complejas
- ✅ Personalización del motor
- ✅ Tipos de datos simples

## 🧪 Pruebas

### Probar ambos motores con ejemplos predefinidos:

```bash
cd backend
python test_compare_engines.py
```

Esto ejecutará 12 desafíos CEL en ambos motores y mostrará:
- Resultados comparativos
- Tasa de éxito de cada motor
- Ganador general

### Probar solo CEL Common:

```bash
python test_cel_common.py
```

### Probar solo PyCEL:

```bash
python test_cel.py
```

## 🛠️ Configuración Avanzada

### Cambiar el Motor Predeterminado

Edita [`backend/shared/helper.py`](backend/shared/helper.py):

```python
def evaluate_expression(expression: str, variables: dict, language: str = "CEL", engine: str = "common"):
    # Cambia "common" a "pycel" para usar PyCEL por defecto
```

### API Backend

**Endpoint:** `POST http://localhost:8000/api/evaluate`

**Payload:**
```json
{
  "language": "CEL",
  "expression": "user.age > 18",
  "data": {
    "user": {
      "age": 25
    }
  },
  "engine": "common"  // o "pycel"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "result": true,
  "message": "Expresión evaluada exitosamente"
}
```

## 📁 Estructura del Proyecto

```
practica-frontend/
├── backend/
│   ├── main.py                      # API FastAPI
│   ├── requirements.txt             # Dependencias Python
│   ├── challenges.json              # 12 desafíos CEL
│   ├── test_compare_engines.py      # Comparación de motores
│   ├── COMPARACION_ENGINES.md       # Análisis detallado
│   └── shared/
│       ├── helper.py                # Enrutador de motores
│       ├── pycel_engine.py          # Motor PyCEL
│       └── cel_common_engine.py     # Motor CEL Common
└── frontend/
    └── frontend_app/
        └── src/
            └── Components/
                ├── App.jsx          # Componente principal
                ├── Playground.jsx   # Área de trabajo
                └── Controls.jsx     # Controles (selector de motor)
```

## ❌ Limitaciones Conocidas

Ambos motores tienen limitaciones con:

1. **Función `type()`** - No disponible en CEL estándar
2. **Método `sum()`** - No soportado en listas
3. **Regex complejos** - Puede requerir ajuste de sintaxis

Ver [COMPARACION_ENGINES.md](backend/COMPARACION_ENGINES.md) para detalles completos.

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Verificar que las dependencias están instaladas
pip list | grep -E "fastapi|cel-python|common-expression"

# Reinstalar si es necesario
pip install -r backend/requirements.txt
```

### Frontend no inicia
```bash
# Limpiar caché de npm
cd frontend/frontend_app
rm -rf node_modules package-lock.json
npm install
```

### Puerto ya en uso
```bash
# Windows - Encontrar proceso en puerto 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Windows - Encontrar proceso en puerto 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

## 📚 Recursos Adicionales

- [COMPARACION_ENGINES.md](backend/COMPARACION_ENGINES.md) - Análisis detallado de ambos motores
- [EJEMPLOS_CEL.md](backend/EJEMPLOS_CEL.md) - Ejemplos de expresiones CEL
- [INICIO_RAPIDO.md](backend/INICIO_RAPIDO.md) - Tutorial de CEL
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [CEL Specification](https://github.com/google/cel-spec)

## 🎯 Siguiente Pasos

1. ✅ Explorar los 12 desafíos en la interfaz
2. ✅ Comparar resultados entre ambos motores
3. ✅ Revisar [COMPARACION_ENGINES.md](backend/COMPARACION_ENGINES.md)
4. ⏳ Decidir qué motor usar en producción
5. ⏳ Agregar más ejemplos/desafíos

---

**¿Preguntas?** Revisa la documentación en el directorio `backend/` o examina el código fuente.
