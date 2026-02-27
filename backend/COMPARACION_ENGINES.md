# Comparación de Motores CEL

## Resumen Ejecutivo

Se evaluaron dos implementaciones de Common Expression Language (CEL) en Python:

1. **cel-python (PyCEL)**: Implementación pura en Python
2. **common-expression-language (CEL Common)**: Implementación respaldada por Rust

### 🏆 Ganador: **CEL Common (common-expression-language)**

- **Tasa de éxito**: 66.7% (8/12 desafíos)
- **PyCEL**: 58.3% (7/12 desafíos)
- **Diferencia**: +8.4% a favor de CEL Common

---

## Resultados Detallados

### ✅ Desafíos Exitosos en Ambos (6/12)

| # | Desafío | Expresión | PyCEL | CEL Common |
|---|---------|-----------|-------|------------|
| 2 | Comparar números | `price > discount_price` | ✓ | ✓ |
| 3 | Comparar strings | `status == expected_status` | ✓ | ✓ |
| 4 | Comparar fechas | `timestamp(...)` | ✓ | ✓ |
| 5 | Comparar decimales | `temperature > threshold` | ✓ | ✓ |
| 9 | Filtrar lista | `numbers.filter(n, n > 3)` | ✓ | ✓ |
| 10 | Operador ternario | `score >= 90 ? 'Excelente' : ...` | ✓ | ✓ |

### ⚔️ Desafíos con Diferencias

| # | Desafío | Expresión | PyCEL | CEL Common | Ganador |
|---|---------|-----------|-------|------------|---------|
| 1 | Acceso a propiedades | `user.name` | ✗ Error | ✓ | **CEL Common** |
| 8 | Redondeo | `double(int(price * 100)) / 100.0` | ✓ | ✗ Error | **PyCEL** |
| 11 | Múltiples condiciones | `user.role == 'admin' && user.active` | ✗ Error | ✓ | **CEL Common** |

### ❌ Desafíos Fallidos en Ambos (3/12)

| # | Desafío | Expresión | Problema |
|---|---------|-----------|----------|
| 6 | Regex | `email.matches(r'^[a-zA-Z0-9._%+-]+@...')` | Ambos fallan - posible problema con sintaxis de regex |
| 7 | Tipo de dato | `type(value) == int` | Función `type()` no disponible en CEL |
| 12 | Promedio | `...grades.sum()...` | Método `sum()` no disponible en listas |

---

## Análisis de Fortalezas y Debilidades

### 🟢 CEL Common (common-expression-language)

**Fortalezas:**
- ✅ Mejor manejo de acceso a propiedades de objetos
- ✅ Soporte completo de operadores lógicos (`&&`, `||`)
- ✅ Respaldado por Rust (potencialmente más rápido)
- ✅ Mayor tasa de éxito general

**Debilidades:**
- ❌ Problemas con conversiones aritméticas complejas (`double(int(...))`)
- ❌ Sin función `type()`
- ❌ Sin método `sum()` en listas

### 🟡 PyCEL (cel-python)

**Fortalezas:**
- ✅ Mejor manejo de conversiones aritméticas
- ✅ Implementación pura en Python (más fácil de debuggear)
- ✅ Mensajes de error más descriptivos

**Debilidades:**
- ❌ Problemas con acceso a propiedades de objetos diccionario
- ❌ Fallas en operadores lógicos con errores previos
- ❌ Sin función `type()`
- ❌ Sin método `sum()` en listas

---

## Casos de Uso Recomendados

### Usar **CEL Common** si:
- ✅ Necesitas trabajar con objetos JSON complejos
- ✅ Usas muchas condiciones lógicas (`&&`, `||`)
- ✅ Requieres máximo rendimiento
- ✅ Prefieres cumplimiento estricto del estándar CEL

### Usar **PyCEL** si:
- ✅ Necesitas operaciones aritméticas complejas
- ✅ Prefieres debugging más sencillo (código Python puro)
- ✅ Trabajas principalmente con tipos de datos simples
- ✅ Necesitas personalizar el motor CEL

---

## Recomendación Final

**Se recomienda usar CEL Common (common-expression-language)** porque:

1. **Mayor compatibilidad con el estándar CEL** - maneja mejor objetos y condiciones lógicas
2. **Mejor tasa de éxito** - 66.7% vs 58.3%
3. **Respaldo de Rust** - mayor rendimiento y confiabilidad
4. **Mejor para casos de uso reales** - la mayoría de aplicaciones trabajan con objetos JSON y condiciones lógicas

### ⚠️ Limitaciones a considerar:

Ninguna de las dos implementaciones soporta completamente:
- Función `type()` para verificación de tipos
- Método `sum()` en listas (alternativa: usar reduce o calcular manualmente)
- Regex con sintaxis compleja (requiere ajuste de patrones)

### 🔧 Configuración en el Backend

El backend ya está configurado para usar ambos motores. Puedes especificar cuál usar mediante el parámetro `engine`:

```python
# Usar CEL Common (default)
{
    "expression": "user.age > 18",
    "data": {"user": {"age": 25}},
    "engine": "common"  # o simplemente omitir
}

# Usar PyCEL
{
    "expression": "price > 100",
    "data": {"price": 150},
    "engine": "pycel"
}
```

---

## Siguiente Pasos

1. ✅ **Configurar CEL Common como motor predeterminado** (ya está configurado)
2. ⏳ Mantener PyCEL como opción alternativa para casos específicos
3. ⏳ Actualizar documentación de usuario con limitaciones conocidas
4. ⏳ Agregar selector de motor en el frontend
5. ⏳ Investigar soluciones para regex y `sum()`

