"""
Script de prueba para verificar la funcionalidad CEL
Ejecutar: python test_cel.py
"""

import json
from shared.cel_engine import cel_engine


def test_challenges():
    """Prueba todos los desafíos CEL"""
    
    print("=" * 60)
    print("PRUEBA DE DESAFÍOS CEL")
    print("=" * 60)
    
    # Cargar desafíos
    with open('challenges.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        challenges = data['challenges']
    
    passed = 0
    failed = 0
    
    for challenge in challenges:
        print(f"\n{'=' * 60}")
        print(f"Desafío {challenge['id']}: {challenge['title']}")
        print(f"Dificultad: {challenge['difficulty']}")
        print(f"Descripción: {challenge['description']}")
        print(f"{'=' * 60}")
        
        expression = challenge['cel_expression']
        context = challenge['json_input']
        expected = challenge['expected_result']
        
        print(f"\nExpresión CEL: {expression}")
        print(f"Contexto: {json.dumps(context, indent=2)}")
        print(f"Resultado esperado: {expected}")
        
        # Evaluar
        result = cel_engine.evaluate(expression, context)
        
        if result['success']:
            actual = result['result']
            print(f"✓ Evaluación exitosa: {actual}")
            
            # Comparar resultado
            if actual == expected:
                print("✓✓ PASÓ: El resultado coincide con lo esperado")
                passed += 1
            else:
                print(f"✗✗ FALLÓ: Esperado {expected}, obtenido {actual}")
                failed += 1
        else:
            print("✗ Error al evaluar:")
            print(f"  Mensaje: {result.get('message')}")
            print(f"  Error: {result.get('error')}")
            failed += 1
    
    # Resumen
    print(f"\n{'=' * 60}")
    print("RESUMEN")
    print(f"{'=' * 60}")
    print(f"Total: {len(challenges)}")
    print(f"Pasados: {passed} ✓")
    print(f"Fallidos: {failed} ✗")
    print(f"Tasa de éxito: {(passed/len(challenges)*100):.1f}%")
    print(f"{'=' * 60}\n")


def test_basic_examples():
    """Prueba ejemplos básicos de CEL"""
    
    print("\n" + "=" * 60)
    print("EJEMPLOS BÁSICOS CEL")
    print("=" * 60)
    
    examples = [
        {
            "name": "Suma simple",
            "expression": "a + b",
            "context": {"a": 5, "b": 3},
            "expected": 8
        },
        {
            "name": "Comparación",
            "expression": "x > 10",
            "context": {"x": 15},
            "expected": True
        },
        {
            "name": "String concatenación",
            "expression": "name + ' ' + lastname",
            "context": {"name": "Juan", "lastname": "Pérez"},
            "expected": "Juan Pérez"
        },
        {
            "name": "Acceso a propiedades",
            "expression": "user.age",
            "context": {"user": {"name": "María", "age": 25}},
            "expected": 25
        }
    ]
    
    for example in examples:
        print(f"\n{example['name']}:")
        print(f"  Expresión: {example['expression']}")
        print(f"  Contexto: {example['context']}")
        
        result = cel_engine.evaluate(example['expression'], example['context'])
        
        if result['success']:
            actual = result['result']
            match = "✓" if actual == example['expected'] else "✗"
            print(f"  Resultado: {actual} {match}")
            print(f"  Esperado: {example['expected']}")
        else:
            print(f"  ✗ Error: {result.get('message')}")


if __name__ == "__main__":
    print("\n🚀 Iniciando pruebas CEL...\n")
    
    # Ejecutar pruebas básicas
    test_basic_examples()
    
    # Ejecutar desafíos
    test_challenges()
    
    print("✅ Pruebas completadas\n")
