"""
Test comparativo entre PyCEL (cel-python) y CEL Common (common-expression-language)
"""

import json
from shared.pycel_engine import pycel_engine
from shared.cel_common_engine import cel_common_engine


def compare_engines():
    """Compara ambos motores CEL con los mismos ejemplos"""
    
    print("=" * 80)
    print("COMPARACIÓN: PyCEL (cel-python) vs CEL Common (common-expression-language)")
    print("=" * 80)
    
    # Cargar desafíos
    with open('challenges.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        challenges = data['challenges']
    
    pycel_passed = 0
    pycel_failed = 0
    common_passed = 0
    common_failed = 0
    
    for challenge in challenges:
        print(f"\n{'=' * 80}")
        print(f"Desafío {challenge['id']}: {challenge['title']}")
        print(f"{'=' * 80}")
        
        expression = challenge['cel_expression']
        context = challenge['json_input']
        expected = challenge['expected_result']
        
        print(f"Expresión: {expression}")
        print(f"Resultado esperado: {expected}\n")
        
        # Probar con PyCEL
        print("--- PyCEL (cel-python) ---")
        result_pycel = pycel_engine.evaluate(expression, context)
        
        if result_pycel['success']:
            actual_pycel = result_pycel['result']
            if actual_pycel == expected:
                print(f"✓ PASÓ: {actual_pycel}")
                pycel_passed += 1
            else:
                print(f"✗ FALLÓ: Esperado {expected}, obtenido {actual_pycel}")
                pycel_failed += 1
        else:
            print(f"✗ ERROR: {result_pycel.get('message')}")
            print(f"  {result_pycel.get('error', '')[:100]}")
            pycel_failed += 1
        
        # Probar con CEL Common
        print("\n--- CEL Common (common-expression-language) ---")
        result_common = cel_common_engine.evaluate(expression, context)
        
        if result_common['success']:
            actual_common = result_common['result']
            if actual_common == expected:
                print(f"✓ PASÓ: {actual_common}")
                common_passed += 1
            else:
                print(f"✗ FALLÓ: Esperado {expected}, obtenido {actual_common}")
                common_failed += 1
        else:
            print(f"✗ ERROR: {result_common.get('message')}")
            print(f"  {result_common.get('error', '')[:100]}")
            common_failed += 1
    
    # Resumen comparativo
    print(f"\n{'=' * 80}")
    print("RESUMEN COMPARATIVO")
    print(f"{'=' * 80}")
    print(f"\nTotal desafíos: {len(challenges)}")
    print(f"\n{'PyCEL (cel-python)':<40} | {'CEL Common (Rust)':<40}")
    print("-" * 80)
    print(f"{'Pasados: ' + str(pycel_passed) + ' ✓':<40} | {'Pasados: ' + str(common_passed) + ' ✓':<40}")
    print(f"{'Fallidos: ' + str(pycel_failed) + ' ✗':<40} | {'Fallidos: ' + str(common_failed) + ' ✗':<40}")
    print(f"{'Tasa éxito: ' + f'{(pycel_passed/len(challenges)*100):.1f}%':<40} | {'Tasa éxito: ' + f'{(common_passed/len(challenges)*100):.1f}%':<40}")
    
    # Ganador
    print(f"\n{'=' * 80}")
    if common_passed > pycel_passed:
        print(f"🏆 GANADOR: CEL Common (common-expression-language)")
        print(f"   {common_passed - pycel_passed} desafíos más resueltos")
    elif pycel_passed > common_passed:
        print(f"🏆 GANADOR: PyCEL (cel-python)")
        print(f"   {pycel_passed - common_passed} desafíos más resueltos")
    else:
        print(f"🤝 EMPATE: Ambos motores tienen el mismo rendimiento")
    print(f"{'=' * 80}\n")


def test_basic_examples():
    """Prueba ejemplos básicos con ambos motores"""
    
    print("\n" + "=" * 80)
    print("EJEMPLOS BÁSICOS - COMPARACIÓN")
    print("=" * 80)
    
    examples = [
        {
            "name": "Suma simple",
            "expression": "a + b",
            "context": {"data": {"a": 5, "b": 3}},
            "expected": 8
        },
        {
            "name": "Comparación",
            "expression": "x > 10",
            "context": {"data": {"x": 15}},
            "expected": True
        },
        {
            "name": "String concatenación",
            "expression": "name + ' ' + lastname",
            "context": {"data": {"name": "Juan", "lastname": "Pérez"}},
            "expected": "Juan Pérez"
        }
    ]
    
    for example in examples:
        print(f"\n{example['name']}:")
        print(f"  Expresión: {example['expression']}")
        print(f"  Esperado: {example['expected']}")
        
        # PyCEL
        result_pycel = pycel_engine.evaluate(example['expression'], example['context'])
        pycel_status = "✓" if result_pycel.get('success') and result_pycel.get('result') == example['expected'] else "✗"
        pycel_result = result_pycel.get('result', 'ERROR')
        
        # CEL Common
        result_common = cel_common_engine.evaluate(example['expression'], example['context'])
        common_status = "✓" if result_common.get('success') and result_common.get('result') == example['expected'] else "✗"
        common_result = result_common.get('result', 'ERROR')
        
        print(f"  PyCEL:      {pycel_result} {pycel_status}")
        print(f"  CEL Common: {common_result} {common_status}")


if __name__ == "__main__":
    print("\n🚀 Iniciando comparación de motores CEL...\n")
    
    # Ejecutar ejemplos básicos
    test_basic_examples()
    
    # Ejecutar comparación de desafíos
    compare_engines()
    
    print("✅ Comparación completada\n")
