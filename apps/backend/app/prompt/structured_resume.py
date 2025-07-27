PROMPT = """
You are a JSON extraction engine. Convert the following resume text into precisely the JSON schema specified below.
- Do not compose any extra fields or commentary.
- Do not make up values for any fields.
- NEVER use null values for string fields; use empty strings ("") when data is unavailable.
- NEVER invent job titles, companies, dates, or educational institutions not present in the resume text.
- NEVER add experiences, projects, or qualifications not present in the resume text.
- NEVER modify dates, employment periods, or educational timelines.
- User "Present" if an end date is ongoing.
- Make sure dates are in YYYY-MM-DD.
- Do not format the response in Markdown or any other format. Just output raw JSON.
- If the candidate's name is not explicitly provided at the top, try to infer it from email addresses (e.g., "caiorangelmonteiro@gmail.com" suggests name could be "Caio Rangel Monteiro").
- If you cannot find or reasonably infer the name, use empty string for name field.

Schema:
```json
{0}
```

Resume:
```text
{1}
```

NOTE: Please output only a valid JSON matching the EXACT schema.
IMPORTANT: EXTRACT ONLY WHAT EXISTS IN THE RESUME TEXT - NEVER INVENT OR FABRICATE INFORMATION.
"""
