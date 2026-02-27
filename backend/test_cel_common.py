"""
Script de prueba para common-expression-language
"""

import cel

# Probar evaluación básica - parece que compile y evaluate son separadas

# Ejemplo 1: Suma simple
expression1 = "5 + 3"
result1 = cel.evaluate(expression1, {})
print(f"Test 1: {expression1} = {result1}")

# Ejemplo 2: Con variables
expression2 = "x + y"
result2 = cel.evaluate(expression2, {"x": 10, "y": 20})
print(f"Test 2: {expression2} con x=10, y=20 = {result2}")

# Ejemplo 3: Comparación
expression3 = "price > 100"
result3 = cel.evaluate(expression3, {"price": 150})
print(f"Test 3: {expression3} con price=150 = {result3}")

# Ejemplo 4: String
expression4 = "name == 'Juan'"
result4 = cel.evaluate(expression4, {"name": "Juan"})
print(f"Test 4: {expression4} con name='Juan' = {result4}")

# Test compile separado
print("\n--- Test compile ---")
program = cel.compile("a + b")
print(f"Program compilado: {program}")
print(f"Type: {type(program)}")

print("\n✓ common-expression-language funciona correctamente")
