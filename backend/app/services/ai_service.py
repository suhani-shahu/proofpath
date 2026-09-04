import os
from groq import Groq
from dotenv import load_dotenv
import json

load_dotenv()

client = Groq(api_key=os.environ["AI_API_KEY"])

async def generate_json(system_prompt: str, user_prompt: str) -> dict:
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.3,
        response_format={"type": "json_object"}
    )
    
    content = response.choices[0].message.content
    return json.loads(content)