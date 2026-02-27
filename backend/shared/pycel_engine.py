"""
CEL (Common Expression Language) Engine
Implementación usando cel-python para evaluar expresiones CEL
"""

import celpy
from typing import Dict, Any


def flatten_dict(d: Dict[str, Any], parent_key: str = '', sep: str = '_') -> Dict[str, Any]:
    """
    Aplana un diccionario anidado para hacerlo compatible con CEL
    Convierte {'data': {'user': {'name': 'Juan'}}} -> {'data_user_name': 'Juan'}
    """
    items = []
    for k, v in d.items():
        new_key = f'{parent_key}{sep}{k}' if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)


class CELEngine:
    """Motor de evaluación de expresiones CEL"""
    
    def __init__(self):
        self.env = celpy.Environment()
    
    def _prepare_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Prepara el contexto para CEL, aplanando diccionarios anidados
        y manteniendo el acceso directo a las variables
        """
        # Si hay un key 'data', extraemos su contenido al nivel superior
        if 'data' in context and isinstance(context['data'], dict):
            return context['data']
        return context
    
    def validate(self, expression: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Valida si una expresión CEL es sintácticamente correcta
        
        Args:
            expression: Expresión CEL a validar
            context: Variables disponibles para la evaluación
            
        Returns:
            Dict con resultado de validación
        """
        try:
            # Compilar la expresión CEL para validar sintaxis
            _ = self.env.compile(expression)
            
            return {
                "success": True,
                "message": "Expresión CEL válida",
                "expression": expression
            }
            
        except celpy.CELParseError as e:
            return {
                "success": False,
                "message": "Error de sintaxis en expresión CEL",
                "error": str(e),
                "expression": expression
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": "Error al validar expresión CEL",
                "error": str(e),
                "expression": expression
            }
    
    def evaluate(self, expression: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evalúa una expresión CEL con el contexto proporcionado
        
        Args:
            expression: Expresión CEL a evaluar
            context: Diccionario con variables para la evaluación
            
        Returns:
            Dict con resultado de la evaluación
        """
        try:
            # Preparar contexto
            eval_context = self._prepare_context(context)
            
            # Compilar la expresión CEL
            ast = self.env.compile(expression)
            
            # Crear el programa ejecutable
            program = self.env.program(ast)
            
            # Evaluar con el contexto proporcionado
            result = program.evaluate(eval_context)
            
            return {
                "success": True,
                "result": result,
                "expression": expression,
                "data": context
            }
            
        except celpy.CELParseError as e:
            return {
                "success": False,
                "message": "Error de sintaxis en expresión CEL",
                "error": str(e),
                "expression": expression
            }
            
        except celpy.CELEvalError as e:
            return {
                "success": False,
                "message": "Error al evaluar expresión CEL",
                "error": str(e),
                "expression": expression
            }
            
        except KeyError as e:
            return {
                "success": False,
                "message": "Variable no definida en el contexto",
                "error": f"Variable no encontrada: {str(e)}",
                "expression": expression
            }
            
        except AttributeError as e:
            return {
                "success": False,
                "message": "Atributo no encontrado",
                "error": str(e),
                "expression": expression
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": "Error inesperado al evaluar expresión CEL",
                "error": f"{type(e).__name__}: {str(e)}",
                "expression": expression
            }


# Instancia global del motor CEL
pycel_engine = CELEngine()
