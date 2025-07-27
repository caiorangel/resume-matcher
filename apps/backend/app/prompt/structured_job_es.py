PROMPT_ES = """
Eres un motor de extracción JSON. Convierte la siguiente descripción de trabajo exactamente en el esquema JSON especificado a continuación.
- No compongas campos adicionales o comentarios.
- No inventes valores para ningún campo.
- NUNCA uses valores nulos para campos de cadena; usa cadenas vacías ("") cuando los datos no estén disponibles.
- Usa "Presente" si una fecha de finalización está en curso.
- Asegúrate de que las fechas estén en formato AAAA-MM-DD.
- No formatees la respuesta en Markdown o cualquier otro formato. Solo produce JSON sin formato.

Esquema:
```json
{0}
```

Descripción del Trabajo:
```text
{1}
```

NOTA: Por favor, produce solo un JSON válido que coincida EXACTAMENTE con el esquema.
"""