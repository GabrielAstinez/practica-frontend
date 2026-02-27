# Playground de Evaluación de Expresiones CEL

Aplicación web interactiva para aprender y evaluar expresiones CEL (Common Expression Language).

## 🎯 Características

- ✅ Evaluación de expresiones CEL en backend (Python)
- ✅ Validación de sintaxis CEL
- ✅ API REST con FastAPI
- ✅ 12 desafíos de aprendizaje documentados
- ✅ Ejemplos prácticos incluidos
- 🔄 Frontend React (en desarrollo)
- 🔄 Soporte Starlark (próximamente)

## 📋 Requisitos

- Python 3.13.12
- Node.js 24.13.0

## 🚀 Inicio Rápido

### Backend (CEL API)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Servidor disponible en: http://localhost:8000  
Documentación API: http://localhost:8000/docs

### Frontend (React)

```bash
cd frontend/frontend_app
npm install
npm run dev
```

Aplicación disponible en: http://localhost:3000

## 📖 Uso

1. Iniciar backend y frontend
2. Abrir http://localhost:3000 en el navegador
3. Ingresar JSON con datos
4. Escribir expresión CEL
5. Validar o evaluar

### Ejemplo Básico

**JSON Input:**
```json
{
  "data": {
    "a": 1,
    "b": 2
  }
}
```

**Expresión CEL:**
```
a + b
```

**Resultado esperado:** `3`

### Ejemplos Avanzados

**Comparación de precios:**
```json
{
  "data": {
    "price": 100,
    "discount_price": 80
  }
}
```
**Expresión:** `price > discount_price`  
**Resultado:** `true`

**Validación de email:**
```json
{
  "data": {
    "email": "usuario@example.com"
  }
}
```
**Expresión:** `email.matches(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')`  
**Resultado:** `true`

**Operador ternario:**
```json
{
  "data": {
    "score": 85
  }
}
```
**Expresión:** `score >= 70 ? 'Aprobado' : 'Reprobado'`  
**Resultado:** `"Aprobado"`

## 📚 Documentación

### Backend
- [README del Backend](backend/README.md) - Documentación completa
- [Inicio Rápido](backend/INICIO_RAPIDO.md) - Guía paso a paso
- [Ejemplos CEL](backend/EJEMPLOS_CEL.md) - 8+ ejemplos detallados
- [Notas de Implementación](backend/NOTAS_IMPLEMENTACION.md) - Limitaciones y recomendaciones
- [Desafíos JSON](backend/challenges.json) - 12 desafíos programáticos

### Frontend
- [README del Frontend](frontend/frontend_app/README.md)

## 🧪 Probar CEL

Ejecutar script de pruebas incluido:

```bash
cd backend
python test_cel.py
```

Esto ejecuta todos los desafíos y muestra el porcentaje de éxito.

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|------------|
| Backend | Python 3.13, FastAPI, cel-python |
| Frontend | React 19, JavaScript |
| Lenguaje | CEL (Common Expression Language) |
| API | REST con JSON |

## 📝 Desafíos Incluidos

1. ✅ Filtrar valores de JSON
2. ✅ Comparar valores numéricos
3. ✅ Comparar strings
4. ✅ Comparar fechas
5. ✅ Operaciones con decimales
6. ✅ Validar regex (email)
7. ✅ Verificar tipos de datos
8. ✅ Redondear números
9. ⚠️ Filtrar listas (limitado)
10. ✅ Operadores ternarios
11. ⚠️ Objetos anidados (limitado)
12. ⚠️ Agregaciones (en desarrollo)

## ⚠️ Limitaciones Conocidas

- Los objetos JSON anidados tienen soporte limitado
- Algunas funciones CEL avanzadas no están disponibles
- Ver [NOTAS_IMPLEMENTACION.md](backend/NOTAS_IMPLEMENTACION.md) para detalle completo

## 🎓 Para el Desarrollador Junior

Este proyecto es una **Prueba de Concepto (PoC)** diseñada para aprendizaje.

### Objetivos de Aprendizaje
- Implementar API REST con FastAPI
- Integrar librería CEL en Python
- Manejar validación y evaluación de expresiones
- Documentar código y crear ejemplos
- Testing y debugging

### Próximos Pasos
1. Revisar [INICIO_RAPIDO.md](backend/INICIO_RAPIDO.md)
2. Ejecutar `python test_cel.py` para entender funcionamiento
3. Probar API con ejemplos de [EJEMPLOS_CEL.md](backend/EJEMPLOS_CEL.md)
4. Integrar con frontend React
5. Implementar UI de desafíos

## 📦 Estructura del Proyecto

```
practica-frontend/
├── README.md                    # Este archivo
├── backend/
│   ├── main.py                 # API FastAPI
│   ├── requirements.txt        # Dependencias Python
│   ├── test_cel.py            # Script de pruebas
│   ├── challenges.json        # Desafíos
│   ├── EJEMPLOS_CEL.md       # Ejemplos documentados
│   ├── INICIO_RAPIDO.md      # Guía de inicio
│   └── shared/
│       ├── helper.py          # Funciones auxiliares
│       └── cel_engine.py      # Motor CEL
└── frontend/
    └── frontend_app/
        ├── src/
        │   └── Components/     # Componentes React
        └── package.json

```

## 🤝 Contribuir

Para agregar nuevos desafíos:
1. Editar `backend/challenges.json`
2. Actualizar `backend/EJEMPLOS_CEL.md`
3. Ejecutar `python test_cel.py` para verificar

## 📄 Licencia

Proyecto de práctica educativo.


