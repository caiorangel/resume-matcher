PROMPT_PT = """
Você é um mecanismo de extração JSON. Converta o seguinte texto de currículo exatamente no esquema JSON especificado abaixo.
- Não componha campos extras ou comentários.
- Não invente valores para nenhum campo.
- NUNCA use valores nulos para campos de string; use strings vazias ("") quando os dados não estiverem disponíveis.
- NUNCA invente títulos de cargo, empresas, datas ou instituições educacionais que não estejam presentes no texto do currículo.
- NUNCA adicione experiências, projetos ou qualificações que não estejam presentes no texto do currículo.
- NUNCA modifique datas, períodos de emprego ou cronogramas educacionais.
- Use "Presente" se uma data de término estiver em andamento.
- Certifique-se de que as datas estejam no formato AAAA-MM-DD.
- Não formate a resposta em Markdown ou qualquer outro formato. Apenas produza JSON bruto.
- Se o nome do candidato não estiver explicitamente fornecido no topo, tente inferi-lo a partir dos endereços de email (por exemplo, "caiorangelmonteiro@gmail.com" sugere que o nome poderia ser "Caio Rangel Monteiro").
- Se você não conseguir encontrar ou inferir razoavelmente o nome, use string vazia para o campo nome.

Esquema:
```json
{0}
```

Currículo:
```text
{1}
```

NOTA: Por favor, produza apenas um JSON válido correspondendo EXATAMENTE ao esquema.
IMPORTANTE: EXTRAIA APENAS O QUE EXISTE NO TEXTO DO CURRÍCULO - NUNCA INVENTE OU FABRIQUE INFORMAÇÕES.
"""