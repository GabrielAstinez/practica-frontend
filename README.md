# Playground de Evaluación de Expresiones

Aplicación web interactiva para aprender y comparar expresiones en múltiples lenguajes de expresión: **CEL**, **Starlark** y **Lua**.

## 🎯 Características

- ✅ 8 motores de evaluación (server-side y WebAssembly)
- ✅ 12 desafíos de aprendizaje con expresiones en cada motor
- ✅ API REST con FastAPI
- ✅ Evaluación CEL nativa en Go (motor más compatible con el estándar)
- ✅ Evaluación en el navegador sin backend (WebAssembly)
- ✅ Soporte Starlark (servidor Python y WebAssembly)
- ✅ Soporte Lua (servidor Python vía lupa y WebAssembly vía wasmoon)

## 📋 Requisitos

| Herramienta | Versión mínima | Uso |
|---|---|---|
| Python | 3.13+ | Backend FastAPI |
| Node.js | 18+ | Frontend React |
| Go | 1.21+ | Compilar el binario CEL Go (una sola vez) |

## 🚀 Inicio Rápido

### 1. Backend (API Python)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Servidor disponible en: http://localhost:8000  
Documentación API: http://localhost:8000/docs

### 2. Compilar el motor CEL Go (una sola vez)

El motor CEL Go requiere compilar el binario antes de iniciar el backend.
Sólo es necesario hacerlo la primera vez o cuando se modifique `cel_go/main.go`.

```bash
cd backend/cel_go
go mod tidy
go build -o cel_evaluator.exe .   # Windows
# go build -o cel_evaluator .     # Linux / macOS
```

### 3. Frontend (React)

```bash
cd frontend/frontend_app
npm install
npm start
```

Aplicación disponible en: http://localhost:3000

## 🔧 Motores de Evaluación

| Motor (selector) | Lenguaje | Ejecución | Librería |
|---|---|---|---|
| `CEL (common)` | CEL | Servidor Python | `common-expression-language` |
| `CEL (pycel)` | CEL | Servidor Python | `cel-python` |
| `CEL (Go)` | CEL | Servidor Python → binario Go | `github.com/google/cel-go` |
| `CEL (WebAssembly)` | CEL | Navegador (WASM) | `wasm-cel` |
| `Starlark (server)` | Starlark | Servidor Python | `starlark-pyo3` |
| `Starlark (WebAssembly)` | Starlark | Navegador (WASM) | `starlark-wasm` |
| `Lua (server)` | Lua 5.4 | Servidor Python | `lupa` |
| `Lua (WebAssembly)` | Lua 5.4 | Navegador (WASM) | `wasmoon` |

> **Recomendación:** Para CEL estándar use `CEL (Go)` — implementa el spec completo con tipos estrictos, `timestamp()`, `matches()`, `filter()`, operador ternario y `sum()` personalizado.

## 📖 Uso

1. Iniciar backend y frontend
2. Abrir http://localhost:3000
3. Seleccionar un desafío de la lista
4. Elegir el motor en el desplegable
5. Escribir la expresión y hacer clic en **Submit**

### Ejemplo: CEL

```
score >= 90 ? 'Excelente' : score >= 70 ? 'Bueno' : 'Regular'
```

### Ejemplo: Starlark

```python
"Excelente" if score >= 90 else ("Bueno" if score >= 70 else "Regular")
```

### Ejemplo: Lua

```lua
if score >= 90 then
  return 'Excelente'
elseif score >= 70 then
  return 'Bueno'
else
  return 'Regular'
end
```

## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Python 3.13+, FastAPI, uvicorn |
| CEL nativo | Go 1.21+, cel-go v0.27 |
| Frontend | React 19, JavaScript (CRA + CRACO) |
| WASM CEL | wasm-cel 0.5.2 |
| WASM Starlark | starlark-wasm 0.0.4 |
| WASM Lua | wasmoon 1.16.0 |

## 📦 Estructura del Proyecto

```
practica-frontend/
├── README.md
├── backend/
│   ├── main.py                  # API FastAPI (endpoints)
│   ├── requirements.txt         # Dependencias Python
│   ├── challenges.json          # 12 desafíos con expresiones por motor
│   ├── cel_go/
│   │   ├── main.go              # Evaluador CEL nativo en Go
│   │   ├── go.mod
│   │   └── cel_evaluator.exe    # Binario compilado (gitignored)
│   └── shared/
│       ├── helper.py            # Router de motores
│       ├── cel_common_engine.py # Motor common-expression-language
│       ├── pycel_engine.py      # Motor cel-python
│       ├── cel_go_engine.py     # Wrapper Python → binario Go
│       ├── starlark_engine.py   # Motor starlark-pyo3
│       └── lua_engine.py        # Motor lupa (Lua 5.4)
└── frontend/
    └── frontend_app/
        ├── craco.config.js      # Webpack overrides (node fallbacks para WASM)
        ├── package.json
        └── src/
            ├── starlarkWasm.js  # Cliente WASM Starlark
            ├── celWasm.js       # Cliente WASM CEL
            ├── luaWasm.js       # Cliente WASM Lua
            └── Components/
                ├── Playground.jsx
                ├── ExpressionInput.jsx
                └── ...
```

## 📝 Desafíos Incluidos

| # | Título | Dificultad |
|---|---|---|
| 1 | Filtrar un valor desde JSON | Fácil |
| 2 | Comparar dos valores numéricos | Fácil |
| 3 | Comparar strings | Fácil |
| 4 | Comparar fechas | Media |
| 5 | Comparar números decimales | Fácil |
| 6 | Validar patrón regex (email) | Media |
| 7 | Verificar tipo de dato | Fácil |
| 8 | Redondear a 2 decimales | Media |
| 9 | Filtrar lista | Media |
| 10 | Operador ternario / condicional | Media |
| 11 | Múltiples condiciones | Media |
| 12 | Calcular promedio | Difícil |

Cada desafío incluye expresiones de ejemplo para los 8 motores.

## 🧪 Pruebas

```bash
cd backend
python test_cel.py         # CEL (pycel + common)
python test_cel_common.py  # CEL common-expression-language
```

## 📄 Licencia

Proyecto de práctica educativo.


