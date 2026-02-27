# Ejemplos y Desafíos de CEL
## Evaluación de Expresiones CEL - Casos de Prueba

Este archivo contiene ejemplos prácticos de evaluación de expresiones CEL basados en los desafíos del proyecto.

---

## Desafío 1: Filtrar un valor desde un JSON (fila / columna)

**Descripción:** Acceder a un valor específico dentro de un objeto JSON.

**JSON de entrada:**
```json
{
  "data": {
    "user": {
      "name": "Juan",
      "age": 30,
      "email": "juan@example.com"
    }
  }
}
```

**Expresión CEL:**
```cel
user.name
```

**Resultado esperado:** `"Juan"`

---

## Desafío 2: Comparar dos valores y obtener un resultado boolean

**Descripción:** Comparar si dos valores numéricos son iguales.

**JSON de entrada:**
```json
{
  "data": {
    "price": 100,
    "discount_price": 80
  }
}
```

**Expresión CEL:**
```cel
price > discount_price
```

**Resultado esperado:** `true`

---

## Desafío 3: Evaluar si dos strings son iguales

**Descripción:** Comparar dos cadenas de texto.

**JSON de entrada:**
```json
{
  "data": {
    "status": "active",
    "expected_status": "active"
  }
}
```

**Expresión CEL:**
```cel
status == expected_status
```

**Resultado esperado:** `true`

---

## Desafío 4: Comparar si una fecha es mayor que otra

**Descripción:** Comparar dos fechas usando strings ISO 8601.

**JSON de entrada:**
```json
{
  "data": {
    "subscription_end": "2026-12-31T23:59:59Z",
    "current_date": "2026-02-26T00:00:00Z"
  }
}
```

**Expresión CEL:**
```cel
timestamp(subscription_end) > timestamp(current_date)
```

**Resultado esperado:** `true`

---

## Desafío 5: Comparar si un número es mayor que otro

**Descripción:** Comparar valores numéricos con operadores relacionales.

**JSON de entrada:**
```json
{
  "data": {
    "temperature": 25.5,
    "threshold": 20.0
  }
}
```

**Expresión CEL:**
```cel
temperature > threshold
```

**Resultado esperado:** `true`

---

## Desafío 6: Verificar si un string cumple un patrón regex

**Descripción:** Validar que un string coincida con un patrón regex.

**JSON de entrada:**
```json
{
  "data": {
    "email": "usuario@example.com"
  }
}
```

**Expresión CEL:**
```cel
email.matches(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
```

**Resultado esperado:** `true`

---

## Desafío 7: Verificar tipo de dato

**Descripción:** Verificar el tipo de una variable usando funciones de tipo.

**JSON de entrada:**
```json
{
  "data": {
    "value": 42
  }
}
```

**Expresión CEL:**
```cel
type(value) == int
```

**Resultado esperado:** `true`

---

## Desafío 8: Redondear un número a 2 decimales

**Descripción:** Aplicar operaciones matemáticas para redondear.

**JSON de entrada:**
```json
{
  "data": {
    "price": 19.99567
  }
}
```

**Expresión CEL:**
```cel
double(int(price * 100)) / 100.0
```

**Resultado esperado:** `19.99`

---

## Ejemplos Adicionales

### Operaciones con Listas

**JSON de entrada:**
```json
{
  "data": {
    "numbers": [1, 2, 3, 4, 5]
  }
}
```

**Expresión CEL - Filtrar números mayores a 3:**
```cel
data.numbers.filter(n, n > 3)
```

**Resultado esperado:** `[4, 5]`

---

### Operaciones con Maps

**JSON de entrada:**
```json
{
  "data": {
    "user": {
      "name": "Ana",
      "role": "admin",
      "active": true
    }
  }
}
```

**Expresión CEL - Verificar múltiples condiciones:**
```cel
data.user.role == "admin" && data.user.active
```

**Resultado esperado:** `true`

---

### Uso de Operador Ternario

**JSON de entrada:**
```json
{
  "data": {
    "score": 85
  }
}
```

**Expresión CEL:**
```cel
data.score >= 90 ? "Excelente" : data.score >= 70 ? "Bueno" : "Regular"
```

**Resultado esperado:** `"Bueno"`

---

## Cómo usar estos ejemplos

1. Copia el JSON de entrada en el campo "JSON Input" del playground
2. Copia la expresión CEL en el campo "Expression Input"
3. Selecciona "CEL" como lenguaje
4. Selecciona "Backend (API)" como modalidad
5. Haz clic en "Validate" para verificar la sintaxis
6. Haz clic en "Evaluate" para ejecutar y ver el resultado

---

## Notas Importantes

- CEL es case-sensitive: `data.Name` ≠ `data.name`
- Los strings deben estar entre comillas dobles: `"texto"`
- Para regex, usar el prefijo `r` antes de la cadena: `r'^pattern$'`
- Las fechas deben convertirse con la función `timestamp()`
- Los operadores lógicos son: `&&` (AND), `||` (OR), `!` (NOT)
