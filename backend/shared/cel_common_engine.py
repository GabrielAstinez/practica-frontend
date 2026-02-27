"""
CEL (Common Expression Language) Engine
Implementación usando common-expression-language (Rust-backed)
"""

import cel
from typing import Dict, Any


class CELCommonEngine:
    """Motor de evaluación de expresiones CEL usando common-expression-language"""
    
    def __init__(self):
        """Inicializar motor CEL"""
        pass  # common-expression-language no requiere inicialización de environment
    
    def _prepare_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Prepara el contexto para CEL
        Si hay un key 'data', extrae su contenido al nivel superior
        """
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
            _ = cel.compile(expression)
            
            return {
                "success": True,
                "message": "Expresión CEL válida",
                "expression": expression
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": "Error de sintaxis en expresión CEL",
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
            
            # Evaluar directamente (common-expression-language maneja todo)
            result = cel.evaluate(expression, eval_context)
            
            return {
                "success": True,
                "result": result,
                "expression": expression,
                "data": context
            }
            
        except Exception as e:
            error_msg = str(e)
            
            # Clasificar tipo de error
            if "undeclared reference" in error_msg.lower() or "unknown field" in error_msg.lower():
                return {
                    "success": False,
                    "message": "Variable no definida en el contexto",
                    "error": error_msg,
                    "expression": expression
                }
            elif "parse" in error_msg.lower() or "syntax" in error_msg.lower():
                return {
                    "success": False,
                    "message": "Error de sintaxis en expresión CEL",
                    "error": error_msg,
                    "expression": expression
                }
            elif "type" in error_msg.lower():
                return {
                    "success": False,
                    "message": "Error de tipo en la evaluación",
                    "error": error_msg,
                    "expression": expression
                }
            else:
                return {
                    "success": False,
                    "message": "Error inesperado al evaluar expresión CEL",
                    "error": error_msg,
                    "expression": expression
                }


# Instancia global del motor CEL Common
cel_common_engine = CELCommonEngine()
