PROMPT_PT = """
Você é um mecanismo de extração JSON. Converta a seguinte descrição de vaga exatamente no esquema JSON especificado abaixo.
- Não componha campos extras ou comentários.
- Não invente valores para nenhum campo.
- NUNCA use valores nulos para campos de string; use strings vazias ("") quando os dados não estiverem disponíveis.
- Use "Presente" se uma data de término estiver em andamento.
- Certifique-se de que as datas estejam no formato AAAA-MM-DD.
- Não formate a resposta em Markdown ou qualquer outro formato. Apenas produza JSON bruto.

Esquema:
```json
{0}
```

Descrição da Vaga:
```text
{1}
```

NOTA: Por favor, produza apenas um JSON válido correspondendo EXATAMENTE ao esquema.
"""