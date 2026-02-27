# Playground de Evaluación de Expresiones  
## CEL & Starlark – Prueba de Concepto

---

## 1. Introducción

Este documento describe los requerimientos funcionales y técnicos para el desarrollo de una **Prueba de Concepto (PoC)** de un playground interactivo orientado a la **simulación, evaluación y aprendizaje** de expresiones de configuración.

La aplicación permitirá evaluar expresiones sobre datos en formato JSON utilizando **dos lenguajes (CEL y Starlark)** y **dos modalidades de ejecución (Frontend vía WebAssembly y Backend vía API REST)**, con el objetivo de comparar capacidades, experiencia de usuario y viabilidad técnica.

---

## 2. Objetivo General

Diseñar e implementar una aplicación web interactiva que permita:

- Simular la evaluación de expresiones de configuración.
- Facilitar el aprendizaje guiado de lenguajes de reglas.
- Comparar ejecución local (WASM) versus ejecución remota (API).
- Registrar aciertos y errores como métrica de aprendizaje.

---

## 3. Alcance del Proyecto

### 3.1 Incluye
- Playground web funcional.
- Evaluación de expresiones en CEL y Starlark.
- Ejecución en Frontend (WebAssembly) y Backend (FastAPI).
- Desafíos guiados con ejemplos.
- Registro de resultados (aciertos / errores).
- Versionamiento en GitHub.
- Despliegue en Azure App Service.

### 3.2 No Incluye
- Autenticación de usuarios.
- Control de acceso o roles avanzados.
- Optimización de performance a escala productiva.
- UI/UX avanzada (el foco es funcional y educativo).

---

## 4. Requerimientos Funcionales

### 4.1 Interfaz Web (Frontend)

La aplicación debe contar con una **pantalla principal única**, con los siguientes componentes:

- **JSON Input**  
  Área de texto para ingresar datos en formato JSON (record-oriented).

- **Expression Input**  
  Área de texto para ingresar la expresión a evaluar (CEL o Starlark).

- **Selectores**
  - Lenguaje: `CEL | Starlark`
  - Modalidad: `Frontend (WASM) | Backend (API)`

- **Botones**
  - `Validate`: valida sintaxis o compilación.
  - `Evaluate`: ejecuta la expresión.

- **Panel de Resultado**
  - Resultado de la evaluación.
  - Mensajes de error claros.
  - Indicador de éxito o fallo.

- **Panel de Desafíos**
  - Lista de desafíos disponibles.
  - Estado: pendiente / completado / error.

---

### 4.2 Desafíos de Aprendizaje

Cada desafío debe poder resolverse **en ambos lenguajes (CEL y Starlark)**.

1. Filtrar un valor desde un JSON (fila / columna).
2. Comparar dos valores y obtener un resultado boolean.
3. Evaluar si dos strings son iguales.
4. Comparar si una fecha es mayor que otra.
5. Comparar si un número es mayor que otro.
6. Verificar si un string cumple un patrón regex.
7. Verificar tipo de dato.
8. Redondear un número a 2 decimales.

Cada desafío debe incluir:
- JSON de ejemplo.
- Expresión de referencia.
- Resultado esperado.

---

## 5. Requerimientos Técnicos

### 5.1 Tecnologías Obligatorias

| Capa | Tecnología |
|----|-----------|
| IDE | **Visual Studio Code (VS Code)** |
| Frontend | React |
| Backend | Python + FastAPI |
| Lenguajes | CEL, Starlark |
| WASM | CEL WASM, Starlark WASM |
| Versionamiento | Git + GitHub |
| Cloud | Azure App Service |

---

## 6. Resultado Esperado

Al finalizar el proyecto, se contará con una herramienta interactiva orientada a la **simulación y aprendizaje**, que permita evaluar expresiones de configuración y comparar distintas tecnologías y arquitecturas de ejecución.
